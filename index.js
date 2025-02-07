#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import { exec } from 'child_process';

console.log(chalk.bgBlue.white.bold('\n  Welcome to Automation FW  🤖⚙️ \n'));
console.log(chalk.green('🔧 A CLI tool to help you select, install, and configure your automation framework.'));
console.log('');

const frameworks = [
    {
        name: 'Cypress',
        installCommand: 'npm install --save-dev cypress',
        configCommand: 'npx cypress verify'
    },
    {
        name: 'Playwright',
        installCommand: 'npm install --save-dev @playwright/test',
        configCommand: 'npx playwright install'
    },
    {
        name: 'WebdriverIO',
        installCommand: 'npm install --save-dev @wdio/cli',
        configCommand: 'npx wdio config'
    }
];

const languages = [
    { name: 'JavaScript' },
    { name: 'TypeScript' }
];

inquirer
    .prompt([
        {
            type: 'list',
            name: 'framework',
            message: chalk.cyan('Which automation framework do you want to use?'),
            choices: frameworks.map(f => f.name)
        },
        {
            type: 'list',
            name: 'language',
            message: chalk.cyan('Which language do you prefer?'),
            choices: languages.map(l => l.name)
        }
    ])
    .then(answers => {
        const { framework: selectedFramework, language: selectedLanguage } = answers;
        const framework = frameworks.find(f => f.name === selectedFramework);

        console.log(chalk.magenta(`\nYou selected ${selectedFramework} with ${selectedLanguage}.\n`));
        console.log(chalk.yellow(`Installing ${selectedFramework}...\n`));

        // Run the installation command.
        exec(framework.installCommand, (installErr, installStdout, installStderr) => {
            if (installErr) {
                console.error(chalk.red(`Error installing ${selectedFramework}: ${installErr.message}`));
                return;
            }
            console.log(chalk.green(installStdout));
            console.log(chalk.green(`\n${selectedFramework} installed successfully!\n`));

            console.log(chalk.yellow(`Configuring ${selectedFramework}...\n`));
            // Run the configuration command.
            exec(framework.configCommand, (configErr, configStdout, configStderr) => {
                if (configErr) {
                    console.error(chalk.red(`Error configuring ${selectedFramework}: ${configErr.message}`));
                    return;
                }
                console.log(chalk.green(configStdout));
                console.log(chalk.green(`\n${selectedFramework} configuration complete!\n`));
            });
        });
    })
    .catch(error => {
        console.error(chalk.red('Error during prompt:'), error);
    });
