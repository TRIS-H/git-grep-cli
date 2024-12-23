# git-grep-cli

<a href="https://npmjs.com/package/git-grep-cli"><img src="https://badgen.net/npm/v/git-grep-cli" alt="npm package"></a>
<a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/git-grep-cli" alt="node compatibility"></a>

A simple command line tool to search for commit-message or file-content in a git repository to retrieve the corresponding git hash.

It is more convenient and powerful than the native API provided by git, and can help you find files better (including git's --lost-found objects).

## "Regret Medicine" for git

From another point of view, `git-grep-cli` provides stronger "regret medicine" for git, which can help you quickly find lost files (provided that the lost files have been added to the git staging area).

### Example: find a lost file

You can follow these steps to execute it:

```sh
# create a file
echo "hello world" > lost-file-1
# add it to the staging area
git add lost-file-1
# undo the staging area
git restore --staged lost-file-1
# delete the file
rm lost-file-1
```

Now, `lost-file-1` is lost, and you want to find it back. You can use `git-grep-cli` to search for it:

```sh
ggc -s "hello world" -t content
```

You will get the git-hash of `lost-file-1`, and then you can use `git show <hash>` to view the content of this file.

### Example: find a lost git-commit record

You can follow these steps to execute it:

```sh
# create a file
echo "bye bye" > lost-file-2
# add it to the staging area
git add lost-file-2
# commit it
git commit -m "feat: add lost-git-commit"
# undo the commit
git reset --hard HEAD~1
```

You can use `git-grep-cli` to find it back:

```sh
# find the lost git-commit record by file content
ggc -s "bye bye" -t content
# or
# find the lost git-commit record by commit message
ggc -s "lost-git-commit" -t message
```

You will get the git-hash of the lost git-commit record, and then you can use `git show <hash>` to view the content of this commit record. You can also use `git cherry-pick <hash>` to apply this commit record.

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

You can use it in your terminal:

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

## Features

- Support searching for commit-message and file-content
- Support searching for lost files and lost git-commit records (provided that the lost files have been added to the git staging area)
- Support specifying the length of the returned content

## License

MIT
