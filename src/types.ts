export interface Data {
   casi_da_screening: number | null;
   casi_da_sospetto_diagnostico: number | null;
   casi_testati: number | null;
   data: string;
   deceduti: number;
   dimessi_guariti: number;
   ingressi_terapia_intensiva: number | null;
   isolamento_domiciliare: number;
   name: string;
   note: string | null;
   note_casi: string | null;
   note_test: string | null;
   nuovi_positivi: number;
   ricoverati_con_sintomi: number;
   stato: string;
   tamponi: number;
   tamponi_test_antigenico_rapido: number | null;
   tamponi_test_molecolare: number | null;
   terapia_intensiva: number;
   totale_casi: number;
   totale_ospedalizzati: number;
   totale_positivi: number;
   totale_positivi_test_antigenico_rapido: number | null;
   totale_positivi_test_molecolare: number | null;
   variazione_totale_positivi: number;
}

export interface FormattedVaccini {
  [key: string]: number;
}

export interface InitialState {
  data: Data[];
  totaleDosiVaccino: number | null;
  dataSetTitle: string;
  selectedDateDaily: string;
  selectedDatePositive: string;
  hideForProvince: boolean;
  currentLanguage: string;
  isLoading: boolean;
  hasErrored: boolean;
  noData: boolean;
}