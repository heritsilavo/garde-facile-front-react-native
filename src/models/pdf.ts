export class PdfModel {
    id: number;
    filename: string;
    password: string;
    image: string;
    description: string;
  
    constructor(id: number, filename: string, password: string, image: string, description:string) {
      this.id = id;
      this.filename = filename;
      this.password = password;
      this.image = image;
      this.description = description;
    }
  }