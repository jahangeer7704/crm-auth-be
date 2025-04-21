export class HealthResponseDTO {
    uptime: number;
    timestamp: string;

     constructor(data: Partial<HealthResponseDTO>) {
        this.uptime = data?.uptime ?? process.uptime();
        this.timestamp = data?.timestamp ?? new Date().toISOString();
    }

}