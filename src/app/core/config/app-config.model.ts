export interface ContactConfig {
  readonly email: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly linkedin: string;
  readonly github: string;
  readonly location: string;
}

export interface AppConfig {
  readonly production: boolean;
  readonly siteUrl: string;
  readonly defaultLanguage: 'en' | 'ar';
  readonly cvFileName: string;
  readonly contact: ContactConfig;
}

/** Shape of the optional public/config.json runtime override. Every field is
 * optional — only what a given deployment needs to override without a
 * rebuild (typically just `siteUrl`) has to be present. */
export type AppConfigOverride = Partial<Omit<AppConfig, 'contact'>> & {
  contact?: Partial<ContactConfig>;
};
