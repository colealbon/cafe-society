# cafe-society-news
source code for cafe-society.news  

[![Netlify Status](https://api.netlify.com/api/v1/badges/61672395-2286-421e-9bf2-354d823d18cb/deploy-status)](https://app.netlify.com/sites/eloquent-cray-319909/deploys)

## What is cafe-society.news?
cafe-society.news is an RSS reader with customizable filters.   Articles can be marked as read so you don't have to weed through yesterday's news.  Filter and feed sharing via blockstack.  Plans for incentivised collaboration.

## The goals
- create a community curated newspaper with an agenda resistant pledge drive style business plan
- better understand the toolkit needed to create and operate a robust decentralized business.  This application will answer questions like "how do people connect with each other instead of only to corporate?  Why would they do that?  What is best in class security in practice?  What are the interchangeable/swappable components required to remain future proof? (ex storage, cpu, bandwidth)"  
- toolkit that is capable of supporting "composable" man/machine curators who can collaborate to achieve real time highly personalized quality censorship resistant, sybil attack resistant news feeds.

- 3 week hackathon brainstorm:

IDEA 1 - economic engine for participation
 ability to perform an operation like add a filter for a given section context.  Request verification by posting a message to a bulletin board. Bulletin board tracks accomplishments and creates a dividend contract (updated in real time) the dividend contract lowers the participation award for a given operation over the course of a week.  dividend contract will use blockstack smart contracts.   Bulletin board will provide value by periodically running the filters, identifying duplicate and partially/overlapping duplicate filters, cleaning out old/unused filters.

other operations:
- add/reject a filter for a category 
- add/reject a category to a feed item
- add/reject a duplicate flag linking to another feed item that is the same content.
- approve/reject a dividend proposal, rejecting a divend proposal will move the rejected recipient to the bottom of the pile (not sure what the pile is, possible re-encryption). 

IDEA 2
scriptless scripts to allow a reader to pay directly to the curator for only the sections of the newspaper they want to read.  cafe-society provides a bulletin board for curators to offer their service (perhaps it could use the same scriptless script approach to provide access).  instead of scriptless scripts, maybe use a blockstack smart contract.  

IDEA 3 
- user offers an encrypted feed for sale "example deduplicated sports"
- someone purchases by registering a public encryption key and sending money to an address (each customer or each payment has a derive path to the HD public key)
- content provider verifies payment is current then reencrypts/persists purchased content.

