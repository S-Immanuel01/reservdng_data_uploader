describe('RESERVDNG RESTAURANTS UPLOAD', { testIsolation: false }, () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=794979234#gid=794979234'

  const range = {
    'start': 10,
    'end': 10
  }

  let restaurants: Array<Record<string, any>> = []
  let token: string

  before(() => {
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const restaurants_sheet = sheets[0]?.data ?? []

      restaurants = restaurants_sheet.slice(range.start + 1, range.end + 2).map((row) => ({
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
        checkInInstruction: row[19] ?? 'Some default instruction',
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

  it('UPLOADS ALL restaurants', () => {
    cy.wrap(restaurants).each((_restaurant: any) => {
      cy.visit('/restaurants/create')
      cy.get('input[name="_token"]').invoke('val').then((value) => {
        token = value?.toString() ?? ''
      })

      cy.getCookie('XSRF-TOKEN').then((xsrfCookie) => {
        cy.getCookie('reservdng_session').then((sessionCookie) => {
          const decodedToken = decodeURIComponent(xsrfCookie!.value)

          cy.task('multipartRequest', {
            url: 'https://reservdng.com/restaurants',
            headers: {
              'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie!.value),
              'X-CSRF-TOKEN': token,
              'x-csrf-token': token,
              'Cookie': `XSRF-TOKEN=${xsrfCookie!.value}; reservdng_session=${sessionCookie!.value}`,
            },
            fields: {
              name: _restaurant.name,
              type: _restaurant.type,
              bedrooms: _restaurant.bedrooms,
              bathrooms: _restaurant.bathrooms,
              guests: _restaurant.guests,
              highlight: _restaurant.highlight,
              description: _restaurant.description,
              features: _restaurant.features,
              host_name: _restaurant.hostName,
              host_phone: _restaurant.hostPhone,
              host_email: _restaurant.hostEmail,
              host_whatsapp: _restaurant.hostWhatsappNumber,
              address: _restaurant.address,
              city: _restaurant.city,
              state: _restaurant.state,
              landmarks: _restaurant.landmarks,
              checkin_instructions: _restaurant.checkInInstruction,
              house_rules: _restaurant.houseRules,
              checkin_time: _restaurant.checkInTime,
              checkout_time: _restaurant.checkOutTime,
              kitchen_amenities: _restaurant.kitchenAmenities,
              living_amenities: _restaurant.livingAmenities,
              bedroom_amenities: _restaurant.bedroomAmenities,
              general_amenities: _restaurant.generalAmenities,
              cancellation_highlight: _restaurant.cancellationHighlights,
              cancellation_policy: _restaurant.cancellationPolicy,
              daily_rate: _restaurant.dailyRate,
              caution_fee: _restaurant.cautionFee,
              min_restaurant: _restaurant.minimumStay,
              min_advance_booking: _restaurant.advancedBooking,
              transportation: _restaurant.transportation,
              _token: token
            },
            files: {
              "host_photo": 'cypress/fixtures/host/hotel.jpg',
              'photos': ['cypress/fixtures/hotel.jpg'],
            },
          }).then((result: any) => {
            cy.log(JSON.stringify(result.body, null, 2))
            console.log(result.body)
            expect(result.status).to.eq(200)

          })

        })
      })

      cy.visit(`/restaurants/${_restaurant.name.toLowerCase().trim().replace(/\s+/g, '-')}`);

      cy.wait(10000)
    })
  })
})