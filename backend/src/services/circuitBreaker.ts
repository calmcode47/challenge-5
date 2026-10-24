export class CircuitBreaker {
  private failures = 0;
  private openUntil = 0;

  public constructor(private readonly maxFailures = 2, private readonly cooldownMs = 30_000) {}

  public get canRun(): boolean {
    return Date.now() >= this.openUntil;
  }

  public recordSuccess(): void {
    this.failures = 0;
    this.openUntil = 0;
  }

  public recordFailure(): void {
    this.failures += 1;
    if (this.failures >= this.maxFailures) this.openUntil = Date.now() + this.cooldownMs;
  }
}
