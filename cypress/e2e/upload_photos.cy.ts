describe('RESERVDNG PHOTOS UPLOAD', () => {
  const url = {
    hotel_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=569941470#gid=569941470',
    stay_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746',
    clubs_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178',
    restaurant_url: 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1538813178#gid=1538813178'
  }
  /// Entry to the code use this to select whether hotel, stay or restaurant
  const sheet_url = url.stay_url

  const filepath = sheet_url == url.hotel_url ? 'hotels'
    : sheet_url == url.restaurant_url ? 'restaurants'
      : sheet_url === url.stay_url ? 'stays'
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
    cy.task<string[]>('getFolderNames', filepath).then(folders => {
      folders.forEach((name) => {
        cy.visit(`${filepath}?q=${name}&sort=recommended&page=1&per_page=12`)
        cy.contains('button', 'view ', { matchCase: false }).first().parent().invoke('attr', 'href').then($url => {
          cy.task<string[]>('findFixtureImages', {
            searchString: name,
            subfolder: filepath
          }).then(($imagesPath) => {
            if (!$imagesPath || $imagesPath.length === 0) {
              cy.log(`No images found for "${name}", skipping`)
              return  // skip this card
            }

            cy.visit($url + "/gallery")

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

      });
    })

    cy.wait(10000)
  })
})