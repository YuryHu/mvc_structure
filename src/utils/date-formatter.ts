export class DateFormatter {
  private year: number = 0;

  private month: string = '';

  private day: string = '';

  private hours: string = '';

  private minutes: string = '';

  private seconds: string = '';

  makeDoubleDigitNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  formatTimeStamp(timeStamp: number): string {
    this.getDateTimeComponents(timeStamp);

    return this.getFormattedTime();
  }

  getDateTimeComponents(timeStamp: number): void {
    const date = new Date(timeStamp);

    this.year = date.getFullYear();
    this.month = this.makeDoubleDigitNumber(date.getMonth() + 1);
    this.day = this.makeDoubleDigitNumber(date.getDate());
    this.hours = this.makeDoubleDigitNumber(date.getHours());
    this.minutes = this.makeDoubleDigitNumber(date.getMinutes());
    this.seconds = this.makeDoubleDigitNumber(date.getSeconds());
  }

  getFormattedTime(): string {
    return `${this.day}-${this.month}-${this.year}   ${this.hours}:${this.minutes}:${this.seconds}`;
  }
}
