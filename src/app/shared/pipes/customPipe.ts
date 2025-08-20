import { Pipe } from "@angular/core";

@Pipe({
  name: "customPipe"
})
export class CustomPipe {
  transform(value: string): string {
    // Custom transformation logic
    return value;
  }
}

