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
	.requiredOption('--page <number>', 'The page of persons data results to fetch')
	.action((load) => {

		const urlApi = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${load.page}`;
		const spinner = ora(`Loading ${chalk.bgCyan('Most popular persons')}`).start();

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
            spinner.clear()

						dataJSON.results.map(({id, name, known_for_department, known_for}) => {
							console.log(chalk.white('----------------------------------------'));
							console.log(chalk.white('Person:'));
							console.log('\n');
							console.log('Id:', chalk.yellowBright(id));
							console.log('Name:', chalk.cyanBright(name));
							known_for_department === 'Acting'
							? console.log('Department:', chalk.magentaBright(known_for_department)) : ''
							
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

program
.command('get-person')
.description('Make a network request to fetch the data of a single person')
.requiredOption('-i, --id <id>', 'The id of the person')
.action(({id}) => {

	const spinner = ora(`Loading ${chalk.bgCyan('Fetching the person data...')}`).start();
	const urlApi = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`
	
	https.get(urlApi, (resp) => {
		let data = '';
		
		resp.on('data', (chunk) => {
			data += chunk;
		});
		
		resp.on('end', () => {
			const dataJSON = JSON.parse(data)
			const { name, id, birthday, place_of_birth, known_for_department, biography,also_known_as } = dataJSON;
			// console.log(dataJSON.name)
			console.log(dataJSON);
			setTimeout(() => {
				spinner.clear()
				console.log('\n',chalk.white('----------------------------------------'));
				console.log(chalk.white('Person: \n'));
				console.log('Id:', chalk.yellow.bold(id));
				console.log('Name:', chalk.blue.bold(name));
				console.log('Birthday:', chalk.cyan.bold(birthday), chalk.gray('|'), chalk.cyanBright.bold(place_of_birth))
				known_for_department === 'Acting' ? console.log('Department:', chalk.magentaBright.bold(known_for_department)) : '';
				console.log('Biography:', chalk.grey.bold(biography));

				// a.k.a. section
				also_known_as 
				?
				(console.log('\n', chalk.white('\n')),
				console.log('Also know as:', '\n'),
				also_known_as.map((aka) => { console.log(aka)}),
				console.log('\n'))
				:
				console.log('\n',chalk.yellow.bold(name + 'doesn\'t have any alternate names', '\n'))



				spinner.succeed('Person data loaded')
			}, 1500);
		});

	})

.on('error', (error) => {
	console.log('Error: ' + error.message);
	spinner.fail('Your request has failed')
});

})

program.parse(process.argv);
