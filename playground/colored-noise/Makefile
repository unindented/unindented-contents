all: graph.svg

%.svg: %.dot
	dot -Tsvg $< \
	| npx svgo@1.3.x --enable removeDimensions --pretty --indent 2 --quiet --input - \
	| perl -pe 's/viewBox="(\d+(?:\.[0-9]+)?) (\d+(?:\.[0-9]+)?) (\d+(?:\.[0-9]+)?) (\d+(?:\.[0-9]+)?)"/"viewBox=\"".($$1)." ".($$2*0.5)." ".($$3)." ".($$4)."\""/eg' \
	| sed 's/#f0f/currentColor/g' \
	| sed 's/Sans-Serif/xkcd Script/g' \
	| npx rougher@1.1.x \
	> $@
