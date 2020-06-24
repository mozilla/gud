# Testing documentation

First install [bundler](https://bundler.io/) for ruby:

```
gem install bundler
```

Then, from inside the `docs/` directory, install [jekyll](https://jekyllrb.com/docs/usage/) adapted to github:

```
bundle install --path vendor/bundle --binstubs --gemfile=$PWD/Gemfile
```

You can then test your changes with:

```
bin/jekyll serve
```
