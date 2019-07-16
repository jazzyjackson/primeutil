/* primeutils
 * by Colten Jackson <jazzyjackson@gmail.com>
 * MIT License
 * Adapted from the npm module "isPrime"
 * by TJ Krusinski <tjkrus@gmail.com>
 * MIT License
 * https://github.com/TJkrusinski/isprime/issues
 *
 * Operates on a resizable prime sieve,
 * capable of storing the primality of every number up to a maximum
 * in a Array of Boolean values whose size is just the same number of bits as the maximum
 * listPrimes(1,000,000) takes 1,000,000 bits to store the primality of 1,000,000 numbers.
 * 
 * Very fast lookup! If larger primes have already been calculated,
 * determining if a number is prime is as simple as checking the index of the sieve array
 */

const sieve = []

module.exports = {getSieve, getLabeledSieve, listPrimes, nearestPrime}

function getSieve(max){
	/**
	If the memozied sieve is large enough, just return the slice
	Also .slice returns a copy of the array so that modifications to the returned sieve don't affect the memoized sieve
	**/

	if(sieve.length >= max) return sieve.slice(0, max)	

	/**
	Otherwise, we have to increase the range of our sieve:

	max - sieve.length figures out how many new elements we push to the sieve 
  .join(',').split(',').map(()=>true) fills the empty array with Boolean true
  push(...freshSieve) appends the new values to the existing memoized sieve

	While the entire sieve has to be itereated through by the Sieve of Erastophnes,
	all values already found to be false will be skipped,
	so that adding higher numbers is faster than starting from scratch.
  **/

	let freshSieve = new Array(max - sieve.length).join(',').split(',').map(() => true)
	sieve.push(...freshSieve)

	/**
	This is the Sieve of Erastophanes

	We start by assuming every number is Prime, and marking them as false as
	we iterate through every multiple of the smaller primes (up to our max value)

	It consists of an outer loop which checks the boolean value of
	each number in the array, but if this index was marked false
	by iterating through the multiples of a smaller prime,
	then there's no need to recompute all the multiples -- they will all have been marked false already
	( 
		e.g. 8 is a multiple of 2, so its marked false.
		Every multiple of 8 is a multiple of 2, and will already have been marked false,
		so it saves a lot of computation to skip the inner loop if a number has already been found to be nonprime.
	)
	**/

	for ( var prime = 0, prime <= length, i++) {
    if (sieve[prime]) {
			/**
			If that index was true,
			we iterate through every multiple of that index and mark each one as 'not prime'

			e.g. if our length = 15, we could compute all multiples of 2 up to 15:
			2x2, 2x3, 2x4, 2x5, 2x6, 2x7, 2x8
			2x8 is 16, which no longer satisfies the condition `multiple < max`, so the loop exits
			4, 6, 8, 10, 12, and 14 are all divisible by 2, and are therefore not prime.
			**/
      for (
      	var multiple = prime * prime;
      	multiple < length;
      	multiple += prime
    	) {
        sieve[multiple] = false;
      }
    }
	}
	/** use sieve.slice to make a copy of the array, changes to the returned sieve do not affect the momoized sieve */
	return sieve.slice(0, max)
}


function getLabeledSieve(num){
	/**
	Gets a sieve of requested length but returns each element as a number: isPrime pair
	[ { '0': true },
		{ '1': true },
		{ '2': true },
		{ '3': true },
		{ '4': false},
		{ '5': true } ]
	**/
	return getSieve(num).map((each, index) => ({[index]: each}))
}

function listprimes(max){
	/**
	[true, true, true, true, false, true, false, true, false, false, false]
	is mapped, returning the index for every true value, leaving false values in place
	[0, 1, 2, 3, false, 5, false, 7, false, false, false]
	then filters this Array. conveniently dropping the falsey 0 and returning a list of prime numbers
	[1,2,3,5,7]
	**/
	return getSieve(num).map((each, index) => each && index).filter(Boolean)
}

fuction isPrime(num){
	// if the memoized seive is large enough, don't bother copying arrays around,
	// just return the boolean stored at the index in question
	if(sieve.length >= num){
		return sieve[num]
	} else {
		// if isPrime is caled on a number higher than what we've already computed,
		// then we have to get a bigger sieve and check the index in question of that
		// this incurs some memory space as the array is copy'd when returned from getSieve
		return getSieve(num)[num]
	}
}

function nearestPrime(num, min = -Infinity, max = Infinity){
	if(isPrime(num)) return num

	nextPrime = num
	prevPrime = num

	while(nextPrime < max && isPrime(nextPrime) == false){ nextPrime++ }
	while(prevPrime > min && isPrime(prevPrime) == false){ prevPrime-- }

	// if a while loop exited because next/prevPrime
	// iterated past the min/max, a prime neigbor wasn't found, null them out
	if(nextPrime > max) prevPrime = NaN
	if(prevPrime < min) prevPrime = NaN

	return prevPrime && !nextPrime           ? prevPrime : // if there was no next prime
         nextPrime && !prevPrime           ? nextPrime : // if there was no prev prime
         !nextPrime && !prevPrime          ? NaN       : // if there is no neighbor prime
         nextPrime - num > num - prevPrime ? nextPrime : // if nextPrime is closer to num
         																		 prevPrime   // if prevPrime is closer to num
}