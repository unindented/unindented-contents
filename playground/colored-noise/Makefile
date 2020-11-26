all: graph.svg

%.svg: %.dot
	dot -Tsvg $< \
	| npx svgo@2.8.x --quiet --input - \
	| sed 's/#f0f/currentColor/g' \
	| sed 's/Sans-Serif/xkcd Script/g' \
	| npx rougher@1.1.x \
	> $@
