## Usage

In order to test the routes on different solutions use the following routes.


``` javascript

# Uses  'Async Await'
http://localhost:3001/I/want/title/await?address=www.google.com
http://localhost:3001/I/want/title/await?address=www.google.com&address=www.ebay.com

# Uses  'Promise.then'
http://localhost:3001/I/want/title/then?address=www.google.com
http://localhost:3001/I/want/title/then?address=www.google.com&address=www.ebay.com

# Uses  'Rxjs'
http://localhost:3001/I/want/title/rxjs?address=www.google.com
http://localhost:3001/I/want/title/rxjs?address=www.google.com&address=www.ebay.com

# Uses  'callback'
http://localhost:3001/I/want/title/callback?address=www.google.com
http://localhost:3001/I/want/title/callback?address=www.google.com&address=www.ebay.com
```
