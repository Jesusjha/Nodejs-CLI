import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config({ path: '../.env' });
import { Command } from 'commander';

// Import Ora to spinner and Chalk to colored text
import ora from 'ora';
import chalk from 'chalk';

const apiKey = process.env.API_KEY;
import https from 'https'

const program = new Command();

program
	.name('movieDB-CLI')
	.description('Pill - CLI to connect with movieDB API')
	.version('0.0.1');

program
	.command('get-persons')
	.description('Make a network request to fetch the most popular persons')
	.requiredOption('-p, --popular', 'Fetch the popular persons')
	.requiredOption(
		'--page <number>',
		'The page of persons data results to fetch'
	)
	.action((load) => {
		const spinner = ora(
			`Loading ${chalk.bgCyan('Most popular persons')}`
		).start();
		setTimeout(() => {
			spinner.color = 'white';
			spinner.text = 'Loading rainbows';
			spinner.succeed('Succeed');
		}, 2000);

		// const page = 2;

		https.get(
			`https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${load.page}`,
			(resp) => {
				let data = '';

				// Data fragment has been received
				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					console.log(JSON.parse(data));
				});
			}
		)
    .on('error', (error) => {
      console.log('error: ' + error.message);
    })
	});

program.parse(process.argv);
