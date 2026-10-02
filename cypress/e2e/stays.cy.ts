describe('RESERVDNG STAYS UPLOAD', { testIsolation: false }, () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=1094586746#gid=1094586746'

  const range = {
    'start': 10,
    'end': 10
  }

  let stays: Array<Record<string, any>> = []

  before(() => {
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const stays_sheet = sheets[0]?.data ?? []

      stays = stays_sheet.slice(range.start + 1, range.end + 2).map((row) => ({
        name: row[2],
        type: row[3],
        bedrooms: row[4],
        bathrooms: row[5],
        guests: row[6],
        highlight: row[7],
        description: row[8],
        features: row[9] ? String(row[9]).split(',').map((a: string) => a.trim()) : [],
        hostName: row[10],
        hostPhone: row[11],
        hostEmail: row[12],
        hostWhatsappNumber: row[13],
        address: row[14],
        city: row[15],
        state: row[16],
        landmarks: row[17],
        transportation: row[18] ? String(row[18]).split(',').map((a: string) => a.trim()) : [],
        checkInInstruction: row[19] ?? ' ',
        checkInTime: row[20],
        checkOutTime: row[21],
        kitchenAmenities: row[22] ? String(row[22]).split(',').map((a: string) => a.trim()) : [],
        livingAmenities: row[23] ? String(row[23]).split(',').map((a: string) => a.trim()) : [],
        bedroomAmenities: row[24] ? String(row[24]).split(',').map((a: string) => a.trim()) : [],
        generalAmenities: row[25] ? String(row[25]).split(',').map((p: string) => p.trim()) : [],
        houseRules: row[26],
        dailyRate: row[27],
        minimumStay: row[28],
        maxStay: row[29],
        advancedBooking: row[30],
        cancellationHighlights: row[31],
        cancellationPolicy: row[32],
        cautionFee: row[33]
      }))
    })

    cy.env<{ EMAIL?: string; PASSWORD?: string }>(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
      if (!EMAIL || !PASSWORD) {
        throw new Error('Missing EMAIL or PASSWORD in Cypress environment. Check the project .env file.');
      }

      return cy.loginWithEmailAndPassword(EMAIL, PASSWORD);
    });


  })

  it('UPLOADS ALL STAYS', () => {
    cy.wrap(stays).each((_stay: any) => {
      cy.visit('/')
      cy.get('span.rounded-full')
        .first()
        .click({ force: true })
      cy.contains('New Location')
        .click()
      cy.get('.grid.gap-8 .p-6')
        .eq(2)
        .click()
      cy.get('[type="file"]')
        .each(($input) => cy.wrap($input).selectFile('cypress/fixtures/hotel.jpg', { force: true }))

      // step 1 property
      cy.contains('label', 'Property Name', { matchCase: false })
        .siblings('input')
        .type(_stay.name)
      // enter property type
      cy.contains('.amenity-chip', _stay.type, { matchCase: false }).click()
      // enter property capacity
      cy.contains('h3', 'Property Capacity', { matchCase: false })
        .siblings('div').then(($div) => {
          // enter number of bedrooms
          cy.wrap($div).contains('label', 'bedrooms', { matchCase: false })
            .parent()
            .find('input')
            .clear()
            .type(_stay.bedrooms)
          // enter number of bathrooms
          cy.wrap($div).contains('label', 'Bathrooms', { matchCase: false })
            .parent()
            .find('input')
            .clear()
            .type(_stay.bathrooms)
          // enter total number of guests
          cy.wrap($div).contains('label', 'Max Guests', { matchCase: false })
            .parent()
            .find('input')
            .clear()
            .type(_stay.guests)
        })
      // entr property highlight
      cy.contains('label', 'Property Highlight', { matchCase: false })
        .siblings('textarea')
        .type(_stay.highlight)
      // Enter property description
      cy.contains('label', 'Description', { matchCase: false })
        .siblings('textarea')
        .type(_stay.description)
      // Enter property features
      cy.contains('h3', 'Property Features', { matchCase: false })
        .siblings('div').then(($div) => {
          cy.log(`stays features: ${_stay.features}`)
          // Click each features
          _stay.features.forEach((amenity: string) => {
            cy.wrap($div).find('.amenity-chip')
              .contains(amenity, { matchCase: false })
              .click()
          })
        })
      // Go to page 2
      cy.contains('button>div', '2').click()

      // STEP 2 PROPERTY LOCATION
      // STREET ADDRESS
      cy.contains('label', 'Street Address', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.address)
      // ENTER CITY
      cy.contains('label', 'City', { matchCase: false })
        .siblings('input')
        .type(_stay.city)
      // SELECT STATE
      cy.contains('label', 'State', { matchCase: false })
        .siblings('select')
        .select(_stay.state)
      // ENTER LANDMARKS
      cy.contains('label', 'Nearby Landmarks', { matchCase: false })
        .siblings('input')
        .type(_stay.landmarks)

      // GETTING AROUND
      cy.contains('h3', 'Getting Around ', { matchCase: false })
        .siblings('div').then(($div) => {
          // Click each transport
          _stay.transportation.forEach((amenity: string) => {
            const _amenity = amenity.split('-').join(' ')
            cy.wrap($div).find('.amenity-chip')
              .contains(_amenity, { matchCase: false })
              .click()
          })
        })

      // HOST/CONTACT PERSON

      // SELECT HOST PHOTO
      cy.contains('p', 'Profile Photo', { matchCase: false }).siblings('label')
        .find('input[type="file"]')
        .selectFile('cypress/fixtures/host/hotel.jpg', { force: true })
      // HOST NAME
      cy.contains('label', 'Host Name', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.hostName)
      // HOST EMAIL
      cy.contains('label', 'Email Address', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.hostEmail)
      // PHONE NUMBER
      cy.contains('label', 'Phone Number', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.hostPhone)
      // HOST WA NUMBER
      cy.contains('label', 'WhatsApp Number', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.hostWhatsappNumber)
      // CLICK ON THE 3RD PAGE
      cy.contains('button>div', '3').click()

      // STEP 3 - AMENITIES
      // KITCHEN AMENITIES
      cy.contains('h3', 'Kitchen', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // Click each transport
          _stay.kitchenAmenities.forEach((amenity: string) => {
            const _amenity = amenity.split('-').join(' ')
            cy.wrap($div).find('.amenity-chip')
              .contains(_amenity, { matchCase: false })
              .click()
          })
        })



      cy.contains('h3', 'Living Area', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // Click each transport
          _stay.livingAmenities.forEach((amenity: string) => {
            const _amenity = amenity.split('-').join(' ')
            cy.wrap($div).find('.amenity-chip')
              .contains(_amenity, { matchCase: false })
              .click()
          })
        })

      cy.contains('h3', 'Bedroom & Bathroom', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // Click each transport
          _stay.bedroomAmenities.forEach((amenity: string) => {
            const _amenity = amenity.split('-').join(' ')
            cy.wrap($div).find('.amenity-chip')
              .contains(_amenity, { matchCase: false })
              .click()
          })
        })

      cy.contains('h3', 'General', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // Click each transport
          _stay.generalAmenities.forEach((amenity: string) => {
            const _amenity = amenity.split('-').join(' ')
            cy.wrap($div).find('.amenity-chip')
              .contains(_amenity, { matchCase: false })
              .click()
          })
        })

      // ARRIVAL
      // CHECK IN TIME
      cy.contains('label', 'Check-in Time', { matchCase: false })
        .siblings('input')
        .type(_stay.checkInTime)
      // CHECK OUT TIME
      cy.contains('label', 'Check-out Time', { matchCase: false })
        .siblings('input')
        .type(_stay.checkOutTime)
      // CHECK IN INSTRUCTION
      cy.contains('label', 'Check-in Instructions', { matchCase: false })
        .parent()
        .find('textarea')
        .type(_stay.checkInInstruction)
      // HOUSE RULES
      cy.contains('h3', 'House Rules', { matchCase: false })
        .parent()
        .parent()
        .siblings('textarea')
        .type(_stay.checkInInstruction)
      // CLICK STEP 4
      cy.contains('button>div', '4').click()

      // STEP 4 - PHOTOS AND PRICING
      // ADD PROPERTY PHOTOS
      cy.contains('label', 'Add Photos', { matchCase: false })
        .find('input[type="file"]')
        .selectFile('cypress/fixtures/hotel.jpg', { force: true })
      // PRICING - DAILY RATE
      cy.contains('label', 'Daily Rate', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.dailyRate)
      // PRICING - CAUTION FEE
      cy.contains('label', 'Caution Fee', { matchCase: false })
        .siblings('div')
        .find('input')
        .type(_stay.cautionFee)
      // NAVIGATE TO STEP 5
      cy.contains('button>div', '5').click()

      // STEP 5 - BOOKING
      // STAYS DURATION
      cy.contains('h3', 'Stay Duration', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // enter number of MINIMUM STAY
          cy.wrap($div).contains('label', 'Minimum Stay', { matchCase: false })
            .parent()
            .find('input')
            .clear()
            .type(_stay.minimumStay)
          // enter number of Maximum Stay
          cy.wrap($div).contains('label', 'Maximum Stay', { matchCase: false })
            .parent()
            .find('input')
          // .type(_stay.bathrooms)
          // enter total number of guests
        })
      // ADVANCED BOOKING
      cy.contains('h3', 'Advance Booking', { matchCase: false })
        .parent()
        .parent()
        .siblings('div').then(($div) => {
          // enter number of MINIMUM Advance
          cy.wrap($div).contains('label', 'Minimum Advance', { matchCase: false })
            .parent()
            .find('input')
            .clear()
            .type(_stay.advancedBooking)
          // enter number of Maximum Advance
          cy.wrap($div).contains('label', 'Maximum Advance', { matchCase: false })
            .parent()
            .find('input')
          // .type(_stay.bathrooms)
          // enter total number of guests
        })
      // CANCELLATION HIGHTLIGHTS
      cy.contains('label', 'Policy Highlight', { matchCase: false })
        .siblings('input')
        .type(_stay.cancellationHighlights)
      // CANCELLATION POLICY
      cy.contains('label', 'Detailed Policy', { matchCase: false })
        .siblings('textarea')
        .type(_stay.cancellationPolicy)
      // NAVIGATE TO STEP 6
      cy.contains('button>div', '6').click()

      // STEP 6 - REVIEW AND PUBLISH
      // CLICK THE PUBLISH BUTTON

      cy.wait(10000)
    })
  })
})