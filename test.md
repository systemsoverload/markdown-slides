footer: TJ Kells | http://kells.tj | https://github.com/systemsoverload
# Python... Whut?

---

# Lets talk about... Division

---

# Division

```python
	>>> x = 5/4
	>>> x == 1.25
```

---

# Division

```python
	>>> x = 5/4
	>>> x == 1.25
	False
```

---
# Whut
![fit original](http://memecrunch.com/meme/1ZOHR/whut-baby/image.png)

---
# Division
future imports FTW

```python
	>>> from __future__ import division

	>>> 5/4 == 1.25
	True
```
![](http://memecrunch.com/meme/1ZOHR/whut-baby/image.png)

---
# Division
Implicit > explicit

```python
	>>> 5.0/4.0 == 1.25
	True
```
![](http://memecrunch.com/meme/1ZOHR/whut-baby/image.png)

---
# Division
... or just use python3.

```bash
	tjkells@deadbeef$ python3
	Python 3.4.2 (default, Oct 19 2014, 17:55:38)
	[GCC 4.2.1 Compatible Apple LLVM 6.0 (clang-600.0.54)] on darwin
	Type "help", "copyright", "credits" or "license" for more information.

	>>> 5/4 == 1.25
	True
```
![](http://memecrunch.com/meme/1ZOHR/whut-baby/image.png)

---
# Lets talk about... Commas

---
# Commas

```python
	>>> a = (1)
	>>> a[0]
```

---
# Commas

```python
	>>> a = (1)
	>>> a[0]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'int' object has no attribute '__getitem__'

```
---
#Whut
![fit original](http://i.imgur.com/xGOCXdj.jpg)

---
# Commas
The suit may make the man, but the comma makes the tuple

```python
	>>> a = 1,
	>>> a[0]
	1
```
![](http://i.imgur.com/xGOCXdj.jpg)

---
# Commas
Commas also unpack args...

```python
	>>> a, b = 1, 2
	>>> a == 1 and b == 2
	True
	>>> c, = 3,
	>>> c == 3
	True
```
![](http://i.imgur.com/xGOCXdj.jpg)

---
# Commas
Not safely though

```python
>>> a, = 1, 2
	Traceback (most recent call last):
	  File "<stdin>", line 1, in <module>
	ValueError: too many values to unpack (expected 1)
```
![](http://i.imgur.com/xGOCXdj.jpg)

---
# Commas
Python3 variable length unpack FTW

```python
	>>> a, *b = (1, 2, 3, 4, 5)
	>>> a
	1
	>>> b
	[2, 3, 4, 5]
```
![](http://i.imgur.com/xGOCXdj.jpg)

---
# Lets talk about... Mutable Defaults

---
# Mutable Defaults

```python
	>>> def add_a_python(things=[]):
	...    things.append('python')
	...    return things
```
---
# Mutable Defaults

```python
	>>> def add_a_python(things=[]):
	...    things.append('python')
	...    return things
	>>> add_a_python() == ['python']
	True
```

---
# Mutable Defaults

```python
	>>> def add_a_python(things=[]):
	...    things.append('python')
	...    return things
	>>> add_a_python() == ['python']
	True
	>>> add_a_python() == ['python']
	False
```

---
#Whut
![fit original](http://i.imgur.com/1xYgQRk.jpg)


---
# Mutable Defaults

- Stored in add\_a\_python.func_defaults (\_\_defaults\_\_ in py3k)

```python
	>>> add_a_python.__defaults__
	(['python', 'python'],)
```
- Can use the builtin locals() to debug this
- Mutations to these defaults persists between function calls

![](http://i.imgur.com/1xYgQRk.jpg)

---
# Lets talk about... Chained Comparison

---
# Chained Comparison

```python
	>>> False is False is False
```

---
# Chained Comparison

```python
	>>> False is False is False
	True
```

---
#Whut
![fit original](http://i.imgur.com/GRd8Nmr.jpg)

---

# Chained Comparisons Actually am Awesome

- Joined with implicit and's
- Evaluates more like "False is False and False is False"
- Enables ternary behavior
- Example:

```python
	>>> if day >= end_date and day <= end_date:
	...     print('This code stinks, refactor it!')

	>>> if end_date <= day <= end_date:
	...     print('Actually am code ninja')
```

![](http://i.imgur.com/GRd8Nmr.jpg)

---
# Learn you a bytecode for great justice

```python
    >>> from dis import dis
	>>> dis(compile('False is False is False', '', 'eval'))
  1           0 LOAD_CONST               0 (False)
              3 LOAD_CONST               0 (False)
              6 DUP_TOP
              7 ROT_THREE
              8 COMPARE_OP               8 (is)
             11 JUMP_IF_FALSE_OR_POP    21
             14 LOAD_CONST               0 (False)
             17 COMPARE_OP               8 (is)
             20 RETURN_VALUE
        >>   21 ROT_TWO
             22 POP_TOP
             23 RETURN_VALUE
	>>> dis(compile('a < b < c', '', 'eval'))
  1           0 LOAD_NAME                0 (a)
              3 LOAD_NAME                1 (b)
              6 DUP_TOP
              7 ROT_THREE
              8 COMPARE_OP               0 (<)
             11 JUMP_IF_FALSE_OR_POP    21
             14 LOAD_NAME                2 (c)
             17 COMPARE_OP               0 (<)
             20 RETURN_VALUE
        >>   21 ROT_TWO
             22 POP_TOP
             23 RETURN_VALUE
```

![](http://i.imgur.com/GRd8Nmr.jpg)

---
# Lets talk about... Object Identity

---
# Object Identity
```python
	>>> a = 1337
	>>> b = 1337
	>>> a is b
```

---
# Object Identity
```python
	>>> a = 1337
	>>> b = 1337
	>>> a is b
	False
```

---
#Phew
![fit original](http://i.imgur.com/nIBr3IY.jpg)

---
# Object Identity
```python
	>>> a = 256
	>>> b = 256
	>>> a is b
```

---
# Object Identity
```python
	>>> a = 256
	>>> b = 256
	>>> a is b
	True
```

---
#Whut
![fit original](http://i.imgur.com/1WubAiB.jpg)

---
#Object Identity

Even Whutter

```python
	>>> a = 1337; b = 1337
	>>> a is b
	True
```
![](http://i.imgur.com/1WubAiB.jpg)

---
# Object Identity
**Or is it?**
- Can get at code object memory addresses with builtin id func

```python
	>>> a = 1337; b = 1337
	>>> c = 'foo'
	>>> d = 'foo'

	>>> id(a)
	4372437232
	>>> id(b)
	4372437232

	>>> id(c)
	4369768368
	>>> id(d)
	4372438992

```
![](http://i.imgur.com/1WubAiB.jpg)

---
# Object Identity
- `is` operator tests for identity NOT equivalence
- This Whut == REPL/Cpython detail
	- Ex. PyPy Int objects return their values from id()
- Cpython caches ints -6 - 256
- Module level compiliation corrects this, unlikely to see in the wild

![](http://i.imgur.com/1WubAiB.jpg)


---
# Lets talk about... Mutable Aliasing

---
# Mutable Aliasing

```python
	>>> nums = [1, 2, 3]
	>>> other_nums = nums
	>>> other_nums.append(4)
	>>> nums
```

---
# Mutable Aliasing

```python
	>>> nums = [1, 2, 3]
	>>> other_nums = nums
	>>> other_nums.append(4)
	>>> nums
	[1, 2, 3, 4]
```

---
#Whut
![fit original](http://i.imgur.com/c2xqlUJ.jpg)


---
# Easy Mnemonic
- Assignment never copies data

![](http://i.imgur.com/c2xqlUJ.jpg)

---
# Easy Mnemonic
- Assignment never copies data
- Assignment never copies data

![](http://i.imgur.com/c2xqlUJ.jpg)

---
# Easy Mnemonic
- Assignment never copies data
- Assignment never copies data
- Assignment never copies data

![](http://i.imgur.com/c2xqlUJ.jpg)

---
# "But Nobody ever gets this wrong!"

```python
	# Fail
	>>> stuff = [1, 2, 3, 4]
	>>> for s in stuff:
	...    s = s + 1
	>>> stuff
	[1, 2, 3, 4]

	# Better
	>>> for idx, val in enumerate(stuff):
	...    stuff[idx] = val + 1
	>>> stuff
	[2, 3, 4, 5]
```

![](http://i.imgur.com/c2xqlUJ.jpg)

---
# Resources

- The Original "Wat"
    [https://www.destroyallsoftware.com/talks/wat](https://www.destroyallsoftware.com/talks/wat)

- Ned Batchelder - Facts and Myths about Python names and values
    [https://www.youtube.com/watch?v=_AEJHKGk9ns](https://www.youtube.com/watch?v=_AEJHKGk9ns)

- Allison Kaptur - Exploring is never boring: understanding CPython without reading the code
    [https://www.youtube.com/watch?v=ZSIRGLmQTLk](https://www.youtube.com/watch?v=ZSIRGLmQTLk)

---
# Thank you!
### TJ Kells
### http://kells.tj
### https://github.com/systemsoverload

