export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  static step(message: string) {
    console.log(`[STEP] ${new Date().toISOString()} - ${message}`);
  }

  static error(message: string) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}
