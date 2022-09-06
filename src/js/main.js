import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('dotenv').config({ path: '../.env' });
import { Command } from 'commander';

// Import Ora to spinner and Chalk to colored text
import ora from 'ora';
import chalk from 'chalk';

const apiKey = process.env.API_KEY;
import https from 'https';

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

		const spinner = ora(`Loading ${chalk.bgCyan('Most popular persons')}`).start();

		const urlApi = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${load.page}`;

		https.get(urlApi, (resp) => {
				let data = '';

				// Data fragment has been received
				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					const dataJSON = JSON.parse(data)
					const pagination = dataJSON.total_pages;
					console.log(JSON.parse(data))
					
          setTimeout(() => {
            // spinner.succeed('Success')

						dataJSON.results.map(({id, name, known_for_department, known_for}) => {
							console.log(chalk.white('----------------------------------------'));
							console.log(chalk.white('Person:'));
							console.log('\n');
							console.log('Id:', chalk.yellowBright(id));
							console.log('Name:', chalk.cyanBright(name));
							known_for_department === 'Acting'
							? console.log('Department:', chalk.magentaBright(known_for_department))
							: '';
							
							if (known_for.length > 0) {
								known_for.map(({id, release_date, title}) => {
									if (title !== undefined) {
										console.log('\n')
										console.log('\t Movie:')
										console.log('\t Id:', chalk.greenBright(id));
										console.log('\t Release date:', chalk.blueBright(release_date));
										console.log('\t Title:', chalk.redBright.bold(title));
										console.log('\n');
									} else {
										console.log('\n','\t', chalk.yellow(`${name} doesn't appear in any movie`), '\n')
									}
								})
							}
						})
						spinner.succeed('Success')

						console.log(chalk.white(`
----------------------------------------
Page: ${load.page} of: ${pagination}
`));
							}, 1000);
						});
					})

			.on('error', (error) => {
				console.log('error: ' + error.message);
        spinner.fail('Request failed')
			});
	});

program.parse(process.argv);
