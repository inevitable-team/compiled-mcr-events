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
    <footer>Sean O'Mahoney</footer>
    <script src="./scripts/main.js"></script>
</body>

</html>
`