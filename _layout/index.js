module.exports = (eventsHTML, groupsHTML, config) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CompiledMCR Events (Manchester Tech Meetups)</title>
    <link rel="stylesheet" href="style.css">
    <meta name="author" content="Sean O'Mahoney"/>
    <meta name="description" content="CompiledMCR Events (Manchester Tech Meetups) - Helping you find technology events through the use of Meetup, Eventbrite & the TechNW Calendar."/>
    <meta name="keywords" content="Manchester, Events, Tech, Technology, Networking, Meetup, Eventbrite, TechNW, CompiledMCR"/>
</head>

<body>
    <header>
        <h1>CompiledMCR Events</h1>
        <p>Powered by <a href='https://www.netlify.com/' rel="noreferrer" target="_blank">Netlify</a>, an open-source project by <a href='https://inevitableinnovations.com/' rel="noreferrer" target="_blank">INEVITABLE</a>, <a href='https://twitter.com/Sean12697/status/1133340835054018560' rel="noreferrer" target="_blank">steps to add to Calendar.</a></p>
    </header>
    <summary>
        <p>Helping you find technology events through the use of Meetup, Eventbrite, the <a href='https://technw.uk/calendar.html' target='_blank' rel="noreferrer">TechNW Calendar</a> & <a href='https://manchestertechevents.com/' target='_blank' rel="noreferrer">Manchester Tech Events</a>.</p>
    </summary>
    <main>
        <div id="typeContainer">
            <div id="selected" class="type">
                <p>Events</p>
            </div>
            <div class="type">
                <p>Groups</p>
            </div>
        </div>
        <div id="itemsContainer">
            <div id="eventContainer" class="itemsContainer">
                <div class="searchDiv">
                    <div id="eventsTopLevel">
                        <input type="button" id="eventsSorts" value="Sorts">
                        <input type="button" id="eventsFilters" value="Filters">
                        <input type="text" id="eventsSearchBox" class="search" value="">
                        <input type="button" id="eventsClearSearch" value="Clear">
                    </div>
                    <!-- <div id="eventsMiddleLevel">
                        <input type="button" id="eventsSourceType" value="Source">
                    </div>
                    <div id="eventsLowLevel">
                        <input type="button" id="eventsSourceEventbrite" value="Eventbrite">
                    </div> -->
                </div>
                <!-- <nav id="eventsNav" class="itemsNav">
                    <div id="eventsSearchBar">Search</div>
                    <div id="eventsReduceBar">Reduce</div>
                    <div id="eventsSpecificBar">Specific</div>
                </nav> -->
                <section id="eventsItems">
                    ${eventsHTML}
                </section>
            </div>
            <div id="groupContainer" class="itemsContainer" style="display:none;">
                <div class="searchDiv">
                    <input type="button" id="groupsSorts" value="Sorts">
                    <input type="button" id="groupFilters" value="Filters">
                    <input type="text" id="groupsSearchBox" class="search" value="">
                    <input type="button" id="groupsClearSearch" value="Clear">
                </div>
                <!-- <nav id="groupsNav" class="itemsNav">
                    <div id="groupsSearchBar">Search</div>
                    <div id="groupsReduceBar">Reduce</div>
                    <div id="groupsSpecificBar">Specific</div>
                </nav> -->
                <section id="groupsItems">
                    ${groupsHTML}
                </section>
            </div>
        </div>
    </main>
    <footer>Find me on <a href="https://github.com/inevitable-team/compiled-mcr-events" target="_blank" rel="noreferrer"><p>GitHub</p></a></footer>
    <div id="toTop"><img src="./img/chevron-arrow-up.svg" width="15px"></div>
    <script src="./scripts/dataToHTML.js"></script>
    <script src="./scripts/main.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.gtagId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.gtagId}');
    </script>

</body>

</html>
`
