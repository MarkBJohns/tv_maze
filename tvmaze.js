"use strict";
console.log('tv maze');
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
const $showsList=$('#showsList');
const $episodesArea=$('#episodesArea');
const $searchForm=$('#searchForm');
const $episodesList=$('#episodesList');
const baseUrl='https://api.tvmaze.com/';
const noImgUrl='https://tinyurl.com/missing-tv';
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

//      TESTING THE CSS OF EACH SHOW CARD

// ==============================================================

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

// ================================================================================================================

//      GETTING SHOWS BY THE SEARCH TERMS

// ==============================================================

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

// ==============================================================

//      PUTTING THE LIST OF SHOWS ON THE WEBPAGE

// ==============================================================

async function populateShows(term){
    const shows=await getShowsByTerm(term);
    $showsList.empty();
    function handleClick($id,$showDiv){
        // The button to access the episodes list removes the other show cards, makes the episode section visible, and changes
        //   the button text to tell the user they can go back to the show list.
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
        $id.on('click',async function(){
            // Handles the button so that it only shows the episodes when the user wants to, and only returns to the shows list
            //   when the user wants to.
            if($id.text()==='Episodes'){
                const id=String($(this).attr('data-show-id'));
                await populateEpisodes(id);
                handleClick($id,$showDiv);
            }else{
                handleClick($id,$showDiv);
            };
        });
        $showLeft.append($image,$id);

        const $header=$('<div>').addClass('header').append($('<h2>').addClass('name').text(show.name));
        const $summary=$('<div>').addClass('summary').html(show.summary);
        $showRight.append($header,$summary);

        $showDiv.append($showLeft,$showRight);

        $showsList.append($showDiv);
    })
}

// ================================================================================================================

//      GETTING THE LIST OF EPISODES BY THE ID

// ==============================================================

async function getEpisodes(id){
    const episodeList=[];
    const result=await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    result.data.forEach(episode=>{
        episodeList.push(episode.name);
    });
    return episodeList;
}

// ==============================================================

//      PUTTING THE EPISODE LISTS ON THE WEBPAGE

// ==============================================================

async function populateEpisodes(id){
    const episodes=await getEpisodes(id);
    $episodesList.empty();
    episodes.forEach(episode=>{
        const $li=$('<li>').text(episode);
       $episodesList.append($li);
    });
}

// ================================================================================================================

//      EVENT LISTENERS

// ==============================================================

$(document).ready(function(){
    $('button').eq(0).on('click',function(){
        // Populates the shows list when a search term is entered into the form
        const searchTerm=$('#searchForm-term').val();
        populateShows(searchTerm);
        $episodesArea.css('display','none');
        $('#searchForm-term').val('');
    });
    $('h1').on('click',function(){
        location.reload();
        // Goes back to the main page by clicking the header
    });
}) 
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
