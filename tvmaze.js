"use strict";
console.log('tv maze');

const $showsList=$('#showsList');
const $episodesArea=$('#episodesArea');
const $searchForm=$('#searchForm');
const baseUrl='https://api.tvmaze.com/';
const noImgUrl='https://tinyurl.com/missing-tv';
// async function getShowsByTerm(term){
//     const results=await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
//     console.log(results.data);
//     results.data.forEach(result=>{
//         console.log(result.show.id);
//         const showId=result.show.id;
//         console.log(result.show.name);
//         const showName=result.show.name;
//         console.log(result.show.summary);
//         const showSummary=result.show.summary;
//         console.log(result.show.image.original);
//         const showImage=result.show.image.original;
//     })
// }

async function getShowsByTerm(term){
    const results=await axios.get(`${baseUrl}search/shows?q=${term}`);
    return results.data.map(result=>{
        const show=result.show;
        return{
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image?show.image.medium:noImgUrl
        };
    });
}
async function makeCard(show){
    const shows=await getShowsByTerm(show);
    if(shows.length>0){
        const $id=$('.id');
        const $name=$('.name');
        const $summary=$('.summary');
        const $image=$('.image');

        $id.text(shows[0].id);
        $name.text(shows[0].name);
        $summary.html(shows[0].summary);
        $image.attr('src',shows[0].image);
    }
}

async function populateShows(term){
    const shows=await getShowsByTerm(term);
    $showsList.empty();
    shows.forEach(show=>{
        const $showDiv=$('<div>').addClass('show');
        const $showLeft=$('<div>').addClass('show-left');
        const $showRight=$('<div>').addClass('show-right');

        const $image=$('<img>').addClass('image').attr('src',show.image);
        const $id=$('<p>').addClass('id').text(show.id);
        $showLeft.append($image,$id);

        const $header=$('<div>').addClass('header').append($('<h2>').addClass('name').text(show.name));
        const $summary=$('<div>').addClass('summary').html(show.summary);
        $showRight.append($header,$summary);

        $showDiv.append($showLeft,$showRight);

        $showsList.append($showDiv);
    })
}