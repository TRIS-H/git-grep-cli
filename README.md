# git-grep-cli

A simple command line tool to search for commit-message or file-content in a git repository to retrieve the corresponding git hash.

It is more convenient and powerful than the native API provided by git, and can help you find files better (including git's --lost-found objects).

## Usage

Install `git-grep-cli` globally, simply run the following command in your terminal:

```sh
npm install -g git-grep-cli
```

Then you can use it in your terminal:

```sh
gg -s <your-search-content> [-t <type>] [-l <length>]
```

## options

- `-s` or `--search` : the search content
- `-t` or `--type` : the search type, `message` for git commit message, `content` for file content, `all` for both
- `-l` or `--length` : the length of the returned content

## Example

```sh
gg -s "hello world" -t content -l 80
```

## License

MIT
