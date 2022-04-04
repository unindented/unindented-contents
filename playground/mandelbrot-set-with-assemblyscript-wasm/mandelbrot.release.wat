(module
 (type $f64_=>_f64 (func (param f64) (result f64)))
 (type $i32_i32_f64_i32_i32_i32_=>_none (func (param i32 i32 f64 i32 i32 i32)))
 (import "env" "memory" (memory $0 0))
 (import "Math" "log" (func $~lib/bindings/Math/log (param f64) (result f64)))
 (import "Math" "log2" (func $~lib/bindings/Math/log2 (param f64) (result f64)))
 (export "update" (func $mandelbrot/update))
 (export "memory" (memory $0))
 (func $mandelbrot/update (param $0 i32) (param $1 i32) (param $2 f64) (param $3 i32) (param $4 i32) (param $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 f64)
  (local $9 i32)
  (local $10 f64)
  (local $11 f64)
  (local $12 f64)
  (local $13 f64)
  (local $14 f64)
  (local $15 f64)
  (local $16 f64)
  (local $17 f64)
  (local $18 i32)
  (local $19 f64)
  (local $20 i32)
  (local $21 i32)
  local.get $2
  local.get $2
  f64.mul
  local.set $11
  f64.const 1
  local.get $3
  f64.convert_i32_u
  f64.div
  local.set $14
  local.get $1
  f64.convert_i32_u
  f64.const 0.5
  f64.mul
  local.set $15
  local.get $0
  f64.convert_i32_u
  f64.const 0.625
  f64.mul
  f64.const 10
  local.get $0
  i32.const 3
  i32.mul
  local.tee $7
  local.get $1
  i32.const 2
  i32.shl
  local.tee $9
  local.get $7
  local.get $9
  i32.lt_s
  select
  f64.convert_i32_s
  f64.div
  local.tee $12
  f64.mul
  local.set $16
  loop $for-loop|0
   local.get $1
   local.get $6
   i32.gt_u
   if
    local.get $6
    f64.convert_i32_u
    local.get $15
    f64.sub
    local.get $12
    f64.mul
    local.set $17
    local.get $0
    local.get $6
    i32.mul
    i32.const 1
    i32.shl
    local.set $18
    i32.const 0
    local.set $7
    loop $for-loop|1
     local.get $0
     local.get $7
     i32.gt_u
     if
      local.get $7
      f64.convert_i32_u
      local.get $12
      f64.mul
      local.get $16
      f64.sub
      local.set $19
      local.get $7
      i32.const 1
      i32.shl
      local.set $20
      f64.const 0
      local.set $2
      f64.const 0
      local.set $8
      f64.const 0
      local.set $13
      f64.const 0
      local.set $10
      i32.const 0
      local.set $9
      loop $while-continue|2
       local.get $4
       local.get $9
       i32.gt_u
       local.get $11
       local.get $13
       local.get $10
       f64.add
       f64.ge
       i32.or
       if
        block $while-break|2
         local.get $8
         local.get $8
         f64.mul
         local.set $10
         local.get $2
         local.get $2
         f64.add
         local.get $8
         f64.mul
         local.get $17
         f64.add
         local.set $8
         local.get $2
         local.get $2
         f64.mul
         local.tee $13
         local.get $10
         f64.sub
         local.get $19
         f64.add
         local.set $2
         local.get $3
         local.get $9
         i32.le_u
         br_if $while-break|2
         local.get $9
         i32.const 1
         i32.add
         local.set $9
         br $while-continue|2
        end
       end
      end
      local.get $5
      i32.const 1
      i32.sub
      local.set $21
      local.get $18
      local.get $20
      i32.add
      local.get $11
      local.get $2
      local.get $2
      f64.mul
      local.get $8
      local.get $8
      f64.mul
      f64.add
      local.tee $2
      f64.lt
      if (result i32)
       local.get $9
       i32.const 1
       i32.add
       f64.convert_i32_u
       local.get $2
       call $~lib/bindings/Math/log
       f64.const 0.5
       f64.mul
       call $~lib/bindings/Math/log2
       f64.sub
       local.get $14
       f64.mul
       f64.const 0
       f64.max
       f64.const 1
       f64.min
       local.get $5
       i32.const 1
       i32.sub
       f64.convert_i32_u
       f64.mul
       i32.trunc_f64_u
      else
       local.get $21
      end
      i32.store16
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $for-loop|1
     end
    end
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|0
   end
  end
 )
)
