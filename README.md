# git-grep-cli

<a href="https://npmjs.com/package/git-grep-cli"><img src="https://badgen.net/npm/v/git-grep-cli" alt="npm package"></a>
<a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/git-grep-cli" alt="node compatibility"></a>

A simple command line tool to search for commit-message or file-content in a git repository to retrieve the corresponding git hash.

It is more convenient and powerful than the native API provided by git, and can help you find files better (including git's --lost-found objects).

## Installing

You need to install `git-grep-cli` globally.

### Package manager

Using npm:

```sh
npm install git-grep-cli -g
```

Using yarn:

```sh
yarn add git-grep-cli -g
```

Using pnpm:

```sh
pnpm add git-grep-cli -g
```

## Usage

Then you can use it in your terminal:

```sh
ggc -s <your-search-content> [-t <type>] [-l <length>]
```

## options

- `-s` or `--search` : the search content
- `-t` or `--type` : the search type, `message` for git commit message, `content` for file content, `all` for both
- `-l` or `--length` : the length of the returned content

## Example

```sh
ggc -s "hello world"
# or
ggc -s "hello world" -t message
# or
ggc -s "hello world" -t content -l 50
```

## License

MIT
