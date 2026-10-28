export const questions=[
['Reverse a string','Return the characters of a string in reverse order.',`function reverse(text) { return [...text].reverse().join(''); }
console.log(reverse('hello'));`,'olleh','Spread converts the string into Unicode code points, reverse flips their order, and join rebuilds it. Combined grapheme clusters need additional handling.','O(n)'],
['Check a palindrome','Ignore spaces, punctuation, and case when checking an English phrase.',`function palindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === [...cleaned].reverse().join('');
}
console.log(palindrome('A man, a plan, a canal: Panama'));`,'true','Normalize both the original and reversed forms before comparison.','O(n)'],
['Find the largest number','Return the largest number, or null for an empty array.',`function largest(numbers) {
  if (!numbers.length) return null;
  return numbers.reduce((best, value) => value > best ? value : best);
}
console.log(largest([3, 9, 2, 7]));`,'9','Keep the largest value seen so far. This avoids spreading a huge array into Math.max.','O(n)'],
['Second-largest distinct number','Return the second-largest unique number, or null when it does not exist.',`function secondLargest(numbers) {
  const unique = [...new Set(numbers)].sort((a, b) => b - a);
  return unique.length > 1 ? unique[1] : null;
}
console.log(secondLargest([8, 8, 3, 5]));`,'5','Remove duplicates, sort descending, and select the second entry.','O(n log n)'],
['Remove duplicates','Return unique array values in first-appearance order.',`const unique = values => [...new Set(values)];
console.log(unique([1, 2, 2, 3, 1]));`,'[1,2,3]','Set stores each primitive value once. Objects are compared by reference.','O(n) expected'],
['Find duplicate elements','Return each repeated value only once.',`function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}
console.log(duplicates([1, 2, 2, 3, 3, 3]));`,'[2,3]','A second set tracks values already seen more than once.','O(n) expected'],
['Count character frequency','Count every character, including spaces and punctuation.',`function frequency(text) {
  const counts = {};
  for (const char of text) counts[char] = (counts[char] || 0) + 1;
  return counts;
}
console.log(frequency('hello'));`,'{"h":1,"e":1,"l":2,"o":1}','Increment the count associated with each character.','O(n)'],
['FizzBuzz','Replace multiples of 3 with Fizz, 5 with Buzz, and both with FizzBuzz.',`function fizzBuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const number = i + 1;
    return (number % 3 === 0 ? 'Fizz' : '') +
      (number % 5 === 0 ? 'Buzz' : '') || number;
  });
}
console.log(fizzBuzz(5));`,'[1,2,"Fizz",4,"Buzz"]','Joining both conditions handles multiples of 15 automatically.','O(n)'],
['Separate even and odd numbers','Group integers by divisibility by two.',`function separate(numbers) {
  return { even: numbers.filter(n => n % 2 === 0),
    odd: numbers.filter(n => n % 2 !== 0) };
}
console.log(separate([1, 2, 3, 4]));`,'{"even":[2,4],"odd":[1,3]}','Using !== 0 also handles negative odd numbers.','O(n)'],
['Sort an array','Sort numbers ascending without changing the input.',`const numbers = [10, 2, 30, 1];
const sorted = [...numbers].sort((a, b) => a - b);
console.log(sorted);`,'[1,2,10,30]','The comparator prevents the default string ordering. Copy first because sort mutates.','Typically O(n log n); engine-dependent'],
['Sum an array','Add all numbers; return zero for an empty array.',`const sum = numbers => numbers.reduce((total, n) => total + n, 0);
console.log(sum([2, 4, 6]));`,'12','The initial accumulator of zero handles empty input.','O(n)'],
['Flatten a nested array','Flatten all nested array levels.',`const flatten = values => values.flat(Infinity);
console.log(flatten([1, [2, [3]], 4]));`,'[1,2,3,4]','Infinity asks flat to visit all nested levels.','O(n) in the total number of visited entries'],
['Find missing numbers','Find integers absent from the inclusive range 1 through n.',`function missing(numbers, n) {
  const present = new Set(numbers);
  const result = [];
  for (let i = 1; i <= n; i++) if (!present.has(i)) result.push(i);
  return result;
}
console.log(missing([1, 3, 5], 6));`,'[2,4,6]','The explicit upper bound also finds missing trailing numbers.','O(n + m), m = input length'],
['Reverse words in a sentence','Reverse word order and normalize repeated whitespace.',`function reverseWords(text) {
  return text.trim().split(/\\s+/).reverse().join(' ');
}
console.log(reverseWords('learn build repeat'));`,'repeat build learn','Split on whitespace, reverse the words, and join with a space.','O(n)'],
['Check anagrams','Check if English words have the same letters, ignoring case and spaces.',`function anagram(a, b) {
  const normalize = text => [...text.toLowerCase().replace(/\\s/g, '')].sort().join('');
  return normalize(a) === normalize(b);
}
console.log(anagram('listen', 'silent'));`,'true','Sorted characters provide a canonical representation. Punctuation remains significant.','O(n log n + m log m)'],
['Count vowels','Count English vowels, ignoring case.',`const vowels = text => (text.match(/[aeiou]/gi) || []).length;
console.log(vowels('Developer'));`,'4','A global regex finds each vowel; the fallback handles no matches.','O(n)'],
['Factorial','Compute n factorial for integers from 0 through 18.',`function factorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 18) throw new Error('Use an integer from 0 to 18');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
console.log(factorial(5));`,'120','The loop avoids recursion; 0! is 1. The bound keeps results within safe integer precision.','O(n)'],
['Fibonacci sequence','Return the first n Fibonacci values, beginning with zero.',`function fibonacci(n) {
  if (!Number.isInteger(n) || n < 0 || n > 79) throw new Error('Use an integer from 0 to 79');
  const result = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
}
console.log(fibonacci(7));`,'[0,1,1,2,3,5,8]','Track the two previous numbers. The upper bound keeps returned values safe integers.','O(n)'],
['map, filter, and reduce','Transform, select, and combine array values.',`const values = [1, 2, 3, 4];
console.log(values.map(n => n * 2));
console.log(values.filter(n => n % 2 === 0));
console.log(values.reduce((sum, n) => sum + n, 0));`,'[2,4,6,8]\n[2,4]\n10','map returns a transformed array; filter selects elements; reduce computes an accumulator.','O(n) for each pass'],
['var, let, and const','Understand function scope, block scope, and reassignment.',`function scopeDemo() {
  var functionScoped = 1;
  let count = 0;
  const user = { name: 'Alex' };
  if (true) { var functionScoped = 2; let count = 99; }
  count += 1;
  user.name = 'Sam'; // const prevents rebinding, not mutation
  console.log(functionScoped, count, user.name);
}
scopeDemo();`,'2 1 Sam','var is function-scoped; let and const are block-scoped and cannot be accessed before initialization.','O(1)'],
['== versus ===','Compare loose equality with strict equality.',`console.log(5 == '5');
console.log(5 === '5');
console.log(null == undefined);
console.log(null === undefined);`,'true\nfalse\ntrue\nfalse','Loose equality may coerce types. Prefer strict equality for predictable comparisons.','O(1) for these primitive comparisons'],
['Promises and async/await','Await an asynchronous result and catch a rejection.',`async function demo() {
  try {
    const answer = await Promise.resolve(42);
    console.log(answer);
    await Promise.reject(new Error('Try again'));
  } catch (error) { console.log(error.message); }
}
await demo();`,'42\nTry again','An async function returns a Promise. await pauses that function, not the whole JavaScript thread.','Depends on the asynchronous operation'],
['Closures','Create a counter that remembers private state.',`function makeCounter() {
  let count = 0;
  return () => ++count;
}
const counter = makeCounter();
console.log(counter());
console.log(counter());`,'1\n2','The returned function retains access to its surrounding lexical environment.','O(1) per call'],
['The event loop','Predict the order of synchronous code, microtasks, and timers.',`console.log('start');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
await new Promise(resolve => setTimeout(resolve, 20));`,'start\nend\npromise\ntimer','Synchronous work finishes first. Promise microtasks run before the next timer task.','Scheduling example; no input-size complexity'],
['Remove falsy values','Remove false, zero, empty strings, null, undefined, and NaN.',`const compact = values => values.filter(Boolean);
console.log(compact([0, 1, false, 2, '', null, 'hello', undefined, NaN]));`,'[1,2,"hello"]','Boolean converts each value to truthiness. This also removes legitimate numeric zero, so use only when intended.','O(n)']
].map(([title,problem,code,output,explanation,complexity],i)=>({id:i+1,title,problem,code,output,explanation,complexity}));
