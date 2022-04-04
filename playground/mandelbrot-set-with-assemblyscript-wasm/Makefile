all: mandelbrot.release.wasm

%.debug.wasm: %.ts
	npx --package assemblyscript@0.19.x asc $? --target debug

%.release.wasm: %.ts
	npx --package assemblyscript@0.19.x asc $? --target release
