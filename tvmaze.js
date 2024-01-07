"use strict";
console.log('tv maze');

const $showsList=$('#showsList');
const $episodesArea=$('#episodesArea');
const $searchForm=$('#searchForm');
const baseUrl='https://api.tvmaze.com/';
const noImgUrl='https://tinyurl.com/missing-tv';

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
    function handleClick($id,$showDiv){
        if($id.text()==='Episodes'){
            $showsList.children('.show').not($showDiv).css('display','none');
            $episodesArea.css('display','block');
            $id.text('Go Back');
        }else{
            $showsList.children('.show').css('display','flex');
            $episodesArea.css('display','none');
            $id.text('Episodes');
        }
    }
    shows.forEach(show=>{
        const $showDiv=$('<div>').addClass('show');
        const $showLeft=$('<div>').addClass('show-left');
        const $showRight=$('<div>').addClass('show-right');

        const $image=$('<img>').addClass('image').attr('src',show.image);
        const $id=$('<p>').addClass('id').text('Episodes').attr('data-show-id',show.id);
        $id.on('click',function(){
            handleClick($id,$showDiv);
        })
        $showLeft.append($image,$id);

        const $header=$('<div>').addClass('header').append($('<h2>').addClass('name').text(show.name));
        const $summary=$('<div>').addClass('summary').html(show.summary);
        $showRight.append($header,$summary);

        $showDiv.append($showLeft,$showRight);

        $showsList.append($showDiv);
    })
}

$(document).ready(function(){
    $('button').eq(0).on('click',function(){
        const searchTerm=$('#searchForm-term').val();
        populateShows(searchTerm);
        $('#searchForm-term').val('');
    })
})