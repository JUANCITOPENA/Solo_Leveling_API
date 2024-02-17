document.getElementById('search-button').addEventListener('click', async function () {
            try {
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                Media(search: "Solo Leveling", type: MANGA) {
                                    title {
                                        romaji
                                        english
                                        native
                                    }
                                    description
                                    averageScore
                                    episodes
                                    characters {
                                        nodes {
                                            name {
                                                full
                                            }
                                            image {
                                                large
                                            }
                                        }
                                    }
                                }
                            }
                        `,
                    }),
                });

                const responseData = await response.json();
                const data = responseData.data.Media;
                const title = data.title.english || data.title.romaji || data.title.native;
                const description = data.description;
                const averageScore = data.averageScore;
                const episodes = data.episodes;
                const characters = data.characters.nodes;

                // Mostrar información del anime
                const animeInfoDiv = document.getElementById('anime-info');
                animeInfoDiv.innerHTML = `
                  <!--   <h2>${title}</h2> -->
                    <p><strong>Descripción:</strong> ${description}</p>
                    <p><strong>Puntuación promedio:</strong> ${averageScore}</p>
                    <p><strong>Episodios:</strong> ${episodes}</p>
                `;

                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';

                const charactersPerRow = 3;
                const remainingCharacters = characters.length % charactersPerRow;
                const charactersToShow = remainingCharacters === 0 ? characters : characters.slice(0, characters.length - remainingCharacters);

                for (let i = 0; i < charactersToShow.length; i += charactersPerRow) {
                    const row = document.createElement('div');
                    row.classList.add('row');

                    for (let j = i; j < i + charactersPerRow && j < charactersToShow.length; j++) {
                        const character = charactersToShow[j];
                        const cardCol = document.createElement('div');
                        cardCol.classList.add('col-md-4');

                        const card = document.createElement('div');
                        card.classList.add('card');

                        const img = document.createElement('img');
                        img.src = character.image.large;
                        img.classList.add('card-img-top');
                        img.alt = character.name.full;

                        const cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');

                        const cardTitle = document.createElement('h5');
                        cardTitle.classList.add('card-title');
                        cardTitle.textContent = character.name.full;

                        cardBody.appendChild(cardTitle);
                        card.appendChild(img);
                        card.appendChild(cardBody);
                        cardCol.appendChild(card);
                        row.appendChild(cardCol);
                    }

                    resultsDiv.appendChild(row);
                }

                // Si queda un personaje por mostrar, centrarlo
                if (remainingCharacters === 1) {
                    const lastCharacter = characters[characters.length - 1];
                    const cardCol = document.createElement('div');
                    cardCol.classList.add('col-md-4');
                    cardCol.classList.add('offset-md-4');

                    const card = document.createElement('div');
                    card.classList.add('card');

                    const img = document.createElement('img');
                    img.src = lastCharacter.image.large;
                    img.classList.add('card-img-top');
                    img.alt = lastCharacter.name.full;

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const cardTitle = document.createElement('h5');
                    cardTitle.classList.add('card-title');
                    cardTitle.textContent = lastCharacter.name.full;

                    cardBody.appendChild(cardTitle);
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    cardCol.appendChild(card);
                    resultsDiv.appendChild(cardCol);
                }

                // Mostrar el botón de Crunchyroll después de buscar
                document.getElementById('crunchyroll-button-container').style.display = 'block';

            } catch (error) {
                console.error('Error al buscar la serie:', error);
        }

});
    