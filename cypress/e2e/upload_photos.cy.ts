describe('RESERVDNG PHOTOS UPLOAD', () => {
  const url = {
    hotel_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=569941470#gid=569941470',
    shortlets_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746',
    clubs_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178',
    restaurant_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178'
  }
  /// Entry to the code use this to select whether hotel, stay or restaurant
  const sheet_url = url.shortlets_url

  // Range of photo on the list
  const range = {
    'start': 10, // from 1 up
    'end': 10
  }

  const filepath = sheet_url == url.hotel_url ? 'hotels'
    : sheet_url == url.restaurant_url ? 'restaurants'
      : sheet_url === url.shortlets_url ? 'stays'
        : sheet_url === url.clubs_url ? 'clubs'
          : 'hotels'

  before(() => {
    cy.env<{ EMAIL?: string; PASSWORD?: string }>(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
      if (!EMAIL || !PASSWORD) {
        throw new Error('Missing EMAIL or PASSWORD in Cypress environment. Check the project .env file.');
      }

      return cy.loginWithEmailAndPassword(EMAIL, PASSWORD);
    });
  })


  it('UPLOADS ALL PHOTOS', () => {
    cy.visit(`/${filepath}?sort_type=created_at~asc&page=${Math.floor(Math.abs(range.start - 1) / 10) + 1}`)

    cy.get('.space-y-6 > a').then(($cards) => {
      const cards = [...$cards].map((card) => ({
        name: card.querySelector('h3')?.textContent?.trim() ?? '',
        href: card.getAttribute('href') ?? ''
      }))

      cy.wrap(cards).each((card: { name: string; href: string }) => {
        cy.task<string[]>('findFixtureImages', {
          searchString: card.name,
          subfolder: filepath
        }).then(($imagesPath) => {
          if (!$imagesPath || $imagesPath.length === 0) {
            cy.log(`No images found for "${card.name}", skipping`)
            return  // skip this card
          }

          cy.visit(card.href + "/gallery")

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

    cy.visit(`/${filepath}?sort_type=created_at~asc&page=${Math.floor(Math.abs(range.start - 1) / 10) + 1}`)
  })
})