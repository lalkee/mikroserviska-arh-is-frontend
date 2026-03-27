export interface Location {
  id?: number;
  name: string;
  address: string;
  capacity: number;
}

export interface Speaker {
  id?: number;
  firstName: string;
  lastName: string;
  title: string;
  expertise: string;
}

export interface Event {
  id?: number;
  name: string;
  agenda: string;
  dateTime: string;
  duration: string;
  registrationFee: number;
  location?: Location;
  speakers?: Speaker[];
}
