describe('RESERVDNG PHOTOS UPLOAD', () => {
  const url = {
    hotel_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=569941470#gid=569941470',
    shortlets_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746',
    clubs_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178',
    restaurant_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178'
  }

  const sheet_url = url.hotel_url

  const range = {
    'start': 10, // from 1 up
    'end': 10
  }

  let hotels = []

  const filepath = sheet_url == url.hotel_url ? 'hotels'
    : sheet_url == url.restaurant_url ? 'restaurants'
      : sheet_url === url.shortlets_url ? 'shortlets'
        : sheet_url === url.clubs_url ? 'clubs'
          : 'hotels'

  before(() => {
    // cy.task('readRemoteExcel', sheet_url).then((sheets) => {
    //   const sheet4 = sheets[0].data

    //   hotels = sheet4.slice(range.start + 1, range.end + 2).map((row) => ({
    //     name: row[2],
    //   }))
    // })

    cy.login('reservation@reservdng.com')
  })


  it('UPLOADS ALL PHOTOS', () => {
    cy.visit(`/hotels?sort_type=created_at~asc&page=${Math.floor(Math.abs(range.start - 1) / 10) + 1}`)

    cy.get('.space-y-6 > a').then(($cards) => {
      const cards = [...$cards].map((card) => ({
        name: card.querySelector('h3')?.textContent?.trim(),
        href: card.getAttribute('href')
      }))

      cy.wrap(cards).each((card) => {
        cy.task('findFixtureImages', {
          searchString: card.name,
          subfolder: filepath
        }).then(($imagesPath) => {
          if (!$imagesPath || $imagesPath.length === 0) {
            cy.log(`No images found for "${card.name}", skipping`)
            return  // skip this card
          }

          cy.visit(card.href + "/gallery/photos")

          // Upload all images
          cy.wrap($imagesPath).each((image) => {
            cy.get('#photos')
              .selectFile(image, { force: true })
          })

          // Go back to the listing page for the next iteration
          cy.contains('Save')
            .click()

          cy.get('[x-ref="sortableList"] :nth-child(2) button.bg-red-600')
            .first()
            .click()

          cy.get('.whitespace-normal [type=submit]')
            .first()
            .click()
        })

      })
    })

    cy.wait(10000)

    cy.visit(`/hotels?sort_type=created_at~asc&page=${Math.floor(Math.abs(range.start - 1) / 10) + 1}`)
  })
})