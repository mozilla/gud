import App from './App.svelte';

const usageCriteria = [
	{name: 'Any Desktop Activity', description: 'The profile has sent a main ping on the day in question.  This is an approximation of whether the profile was running on Firefox Desktop during the day in question.'},
	{name: 'Any Fennec Activity', description: 'Same, but just for fennec.'}
]

const metrics = [
	{
		name: "Monthly Active Users (MAU)",
		description: 'The number of unique profiles that met the usage criterion at least once during the 28-day window ending on the specified day; a single profile will only contribute once to this value no matter how many days that profile used the product.  Note that we consider a month to be 28 days - this has the advantage of removing day-of-week effects from the metric, as four of each weekday are included in the window.'
	}
]

const app = new App({
	target: document.body,
	props: {
		name: 'Smoot Growth Dashboard Prototype',
		usageCriteria, metrics
	}
});

export default app;