export default function convertMinutesToHour(time: number) {
	return new Date(1000 * time * 60).toISOString().substr(11, 5);
}
