# [@check_my_text_bot](https://t.me/check_my_text_bot) code

Uses [Yandex.Speller](https://yandex.ru/dev/speller/) and [glvrd.ru API](https://glvrd.ru/api/).

# Installation and local launch

1. Clone this repo: `git clone https://github.com/backmeupplz/check_my_text_bot`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn install` in the root folder
5. Run `yarn develop`

And you should be good to go! Feel free to fork and submit pull requests. Thanks!

# Environment variables

- `TOKEN` — Telegram bot token
- `MONGO`— URL of the mongo database

Also, please, consider looking at `.env.sample`.

# Continuous integration

Any commit pushed to master gets deployed to [@check_my_text_bot](https://t.me/check_my_text_bot) via [CI Ninja](https://github.com/backmeupplz/ci-ninja).

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
