export interface Semester {
  id: string;
  name: string;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  semester_id: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  drive_link: string;
  subject_id: string;
}

export interface AdminCredentials {
  passcode: string;
}