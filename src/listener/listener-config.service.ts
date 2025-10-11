import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ListenerConfigType } from './listener-config.types';
import { ListenerConfigError } from './listener-config.error';
import { ListenerConfigSchema } from './listener-config.schema';

type JOIType = typeof import('joi');
type YAMLType = typeof import('yaml');
type FSModuleType = typeof import('fs');
type PathModuleType = typeof import('path');

@Injectable()
export class ListenerConfigService {
  private readonly logger = new Logger(ListenerConfigService.name, {
    timestamp: true,
  });

  private listenerConfig: ListenerConfigType | null = null;

  constructor(
    private readonly configService: ConfigService,

    @Inject('JOI') private readonly joi: JOIType,
    @Inject('YAML') private readonly yaml: YAMLType,
    @Inject('FS_MODULE') private readonly fs: FSModuleType,
    @Inject('PATH_MODULE') private readonly path: PathModuleType,
  ) {}

  onModuleInit() {
    this.loadListenerConfig();
  }

  loadListenerConfig() {
    let parsedConfig: ListenerConfigType;

    const listenerConfigEnv = this.configService.get<string>('LISTENER_CONFIG');

    const listenerConfigFilePath = this.configService.get<string>(
      'LISTENER_CONFIG_FILE_PATH',
    ) as string;

    // If the config is provided via env variable, that takes precedence
    // over reading the config from the file path
    //
    if (listenerConfigEnv) {
      this.logger.log(
        `Loading configuration from environment variable LISTENER_CONFIG`,
      );

      parsedConfig = this.parseConfig(listenerConfigEnv.replace(/\\n/g, '\n'));
    } else {
      this.logger.log(
        `Loading configuration from file path: ${listenerConfigFilePath}`,
      );
      const absolutePath = this.getAbsolutePath(listenerConfigFilePath);
      const fileContent = this.readConfigFile(absolutePath);
      parsedConfig = this.parseConfig(fileContent);
    }

    this.validateConfig(parsedConfig);
    this.listenerConfig = parsedConfig;

    this.logger.log('Listener configuration loaded and validated successfully');
  }

  getAbsolutePath(somePath: string): string {
    const absolutePath = this.path.isAbsolute(somePath)
      ? somePath
      : this.path.resolve(process.cwd(), somePath);

    this.logger.log(`Resolved config file path: ${absolutePath}`);
    return absolutePath;
  }

  readConfigFile(filePath: string): string {
    this.assertConfigFileExists(filePath);
    let fileContent: string;
    try {
      fileContent = this.fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      const errorMessage = `Error reading config file at ${filePath}: ${(error as Error).message}`;
      this.logger.error(errorMessage);
      throw new ListenerConfigError(errorMessage);
    }

    return fileContent;
  }

  assertConfigFileExists(configPath: string) {
    if (!this.fs.existsSync(configPath)) {
      const errorMessage = `Config file not found at path: ${configPath}`;
      this.logger.error(errorMessage);

      throw new ListenerConfigError(errorMessage);
    }
  }

  parseConfig(fileContent: string): ListenerConfigType {
    let parsedConfig: ListenerConfigType;

    try {
      parsedConfig = this.yaml.parse(fileContent) as ListenerConfigType;
    } catch (error) {
      const errorMessage = `Error parsing YAML config: ${(error as Error).message}`;
      this.logger.error(errorMessage);
      throw new ListenerConfigError(errorMessage);
    }

    return parsedConfig;
  }

  validateConfig(config: any) {
    const { error } = ListenerConfigSchema.validate(config);

    if (error) {
      const errorMessage = `Invalid listener configuration: ${error.message}`;
      throw new ListenerConfigError(errorMessage);
    }
  }

  assertConfigIsLoaded() {
    if (this.listenerConfig === null) {
      const errorMessage = 'Listener configuration has not been loaded';
      this.logger.error(errorMessage);
      throw new ListenerConfigError(errorMessage);
    }
  }

  get<K extends keyof ListenerConfigType>(key: K): ListenerConfigType[K] {
    this.assertConfigIsLoaded();
    return this.listenerConfig![key];
  }
}
