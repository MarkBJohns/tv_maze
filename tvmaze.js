"use strict";

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