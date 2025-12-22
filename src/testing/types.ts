export interface Currency {
  name: string;
  symbol: string;
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  subregion?: string;
  capital?: string[]; 
  population: number;
  currencies?: Record<string, Currency>; 
  timezones: string[];
  flag: string;
  flags: {
    alt?: string;
  };
}



export type CountryApiResponse = Country[];