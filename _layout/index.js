module.exports = (eventsHTML, groupsHTML) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manchester Tech Meetups</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <h1>Manchester Tech Meetups</h1>
        <p>by Sean O'Mahoney</p>
    </header>
    <summary>
        <p>Helping you find technology events through the use of Meetup, Eventbrite & the TechNW Calendar. </p>
    </summary>
    <main>
        <div id="typeContainer">
            <div id="selected" class="type">
                <p>Event</p>
            </div>
            <div class="type">
                <p>Group</p>
            </div>
        </div>
        <div id="itemsContainer">
            <div id="eventContainer" class="itemsContainer">
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
    <footer><a href="https://twitter.com/sean12697" target="_blank"><p>@Sean12697</p></a><a href="mailto:sean@inevitableteam.com" target="_blank"><p>sean@inevitableteam.com</p></a><a href="https://twitter.com/weareinevitable" target="_blank"><p>@Inevitable</p></a></footer>
    <div id="toTop"><img src="./img/chevron-arrow-up.svg" width="15px"></div>
    <script src="./scripts/main.js"></script>
</body>

</html>
`