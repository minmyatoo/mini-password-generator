const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const generateRandomPassword = (options) => {
    let charset = '';

    if (options.capital) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.small) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) charset += '0123456789';
    if (options.special) charset += '!@#$%^&*()_+[]{}|;:,.<>?';

    let password = '';
    let numbersCount = 0;
    let specialCount = 0;

    for (let i = 0; i < options.length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        const randomChar = charset.charAt(randomIndex);

        if (options.numbers && /[0-9]/.test(randomChar)) {
            numbersCount++;
        }
        if (options.special && /[^a-zA-Z0-9]/.test(randomChar)) {
            specialCount++;
        }

        password += randomChar;
    }

    // Ensure a minimum number of numbers and special characters
    while (numbersCount < options.minNumbers) {
        const randomIndex = crypto.randomInt(0, password.length);
        const randomChar = '0123456789'.charAt(crypto.randomInt(0, 10));
        password = password.slice(0, randomIndex) + randomChar + password.slice(randomIndex);
        numbersCount++;
    }

    while (specialCount < options.minSpecial) {
        const randomIndex = crypto.randomInt(0, password.length);
        const randomChar = '!@#$%^&*()_+[]{}|;:,.<>?'.charAt(crypto.randomInt(0, 15));
        password = password.slice(0, randomIndex) + randomChar + password.slice(randomIndex);
        specialCount++;
    }

    return password;
};

const askQuestions = () => {
    rl.question('🔐 Password length: ', (length) => {
        rl.question('🆒 Include capital letters? (yes/no): ', (capital) => {
            rl.question('🆕 Include small letters? (yes/no): ', (small) => {
                rl.question('🔢 Include numbers? (yes/no): ', (numbers) => {
                    rl.question('🔑 Include special characters? (yes/no): ', (special) => {
                        rl.question('🔢 Minimum number of numbers: ', (minNumbers) => {
                            rl.question('🔑 Minimum number of special characters: ', (minSpecial) => {
                                const options = {
                                    length: parseInt(length) || 12,
                                    capital: capital.toLowerCase() === 'yes',
                                    small: small.toLowerCase() === 'yes',
                                    numbers: numbers.toLowerCase() === 'yes',
                                    special: special.toLowerCase() === 'yes',
                                    minNumbers: parseInt(minNumbers) || 1,
                                    minSpecial: parseInt(minSpecial) || 1,
                                };

                                const password = generateRandomPassword(options);
                                console.log(`✨ Generated Password: ${password}`);

                                rl.close();
                            });
                        });
                    });
                });
            });
        });
    });
};

askQuestions();
