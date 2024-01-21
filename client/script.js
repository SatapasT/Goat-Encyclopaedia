const localHost = 'http://127.0.0.1:8080'
const itemColourDict = { 0: 'bg-light-subtle', 1: 'bg-dark-subtle' }

let currentSpecies
let informationSelection = 'biology'
let currentUser = 'Anonymous'
let orderingSelection = 'time'

function initializeHTML () {
  document.getElementById('login-button').style.display = 'block'
  document.getElementById('information-select').selectedIndex = 0
  document.getElementById('ordering-select').selectedIndex = 0
  document.getElementById('photo-input').value = ''
  document.getElementById('username-signup').value = ''
  document.getElementById('password-signup').value = ''
  document.getElementById('username-login').value = ''
  document.getElementById('password-login').value = ''
  fetchDataDefault()
}

function checkServerStatus () {
  fetch(`${localHost}/goatData/default_goal`)
    .then((response) => {
      if (!response.ok) {
        displayErrorMessage()
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      displayErrorMessage()
    })
}

function displayErrorMessage () {
  document.getElementById('navbar').style.display = 'none'
  document.getElementById('main-container').style.display = 'none'
  document.getElementById('background-image').style.display = 'none'
  document.getElementById('error-page').style.display = 'block'
}

function checkErrorServerStatus () {
  fetch(`${localHost}/goatData/default_goal`)
    .then((response) => {
      if (response.ok) {
        document.getElementById('navbar').style.display = 'block'
        document.getElementById('main-container').style.display = 'block'
        document.getElementById('background-image').style.display = 'block'
        document.getElementById('error-page').style.display = 'none'
        updatePage()
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      alert('Server is not reachable! Try reloading in a few moment!')
    })
}

function upperCase (word) {
  try {
    const firstLetter = word.charAt(0)
    const newWord = firstLetter.toUpperCase() + word.substring(1)
    return newWord
  } catch (error) {
    return word
  }
}

function hideModal (id) {
  const modalElement = document.getElementById(id)
  modalElement.classList.remove('show')
  modalElement.style.display = 'none'
  document.body.classList.remove('modal-open')
  document.querySelector('.modal-backdrop').remove()
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}

function formatDate (currentDate) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const day = currentDate.getDate()
  return `${day}/${month}/${year}`
}

function formatTime (currentDate) {
  const hour = currentDate.getHours()
  const minute = currentDate.getMinutes() + 1
  const second = currentDate.getSeconds()
  return `${hour}:${minute}:${second}`
}

function fetchGoatData (speciesValue) {
  currentSpecies = speciesValue
  updatePage()
  updateImg()
  informationSelected()
}

function fetchDataDefault () {
  fetchGoatData('default_goat')
  const navItem = document.querySelectorAll('.nav-link')
  for (let i = 0; i < navItem.length; i++) {
    navItem[i].classList.remove('active')
  }
}

function informationSelected () {
  informationSelection = document.getElementById('information-select').value
  updateInformation()
}

function orderingSelected () {
  orderingSelection = document.getElementById('ordering-select').value
  updateCommentThread()
}

function updatePage () {
  updateTitle()
  updateInformation()
  updateCommentInfo()
  updateCommentThread()
  updateImg()
  updateNameDisplay()
}

function userLogout () {
  currentUser = 'Anonymous'
  document.getElementById('login-button').style.display = 'block'
  document.getElementById('logout-button').style.display = 'none'
  updateNameDisplay()
}

function updateNameDisplay () {
  document.getElementById('name-div').innerHTML = currentUser
}

async function updateTitle () {
  await fetch(`${localHost}/goatData/${currentSpecies}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('display-center').innerHTML = `<strong> > ${data.name.toString()} < </strong>`
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      displayErrorMessage()
    })
}

async function updateInformation () {
  const queryType = informationSelection
  const list = []

  const stringFind = ['Pros', 'Cons']
  const proConColourDict = { 1: 'bg-success-subtle', 2: 'bg-danger-subtle' }

  let headerPosition = 0
  await fetch(`${localHost}/goatData/${currentSpecies}`)
    .then((response) => response.json())
    .then((data) => {
      switch (queryType) {
        case 'pro-con':
          for (let i = 0; i < data[queryType].length; i++) {
            const entry = data[queryType][i]
            if (entry.includes(stringFind[headerPosition])) {
              headerPosition += 1
              list.push(`
                        <div class="col text-start ${proConColourDict[headerPosition]} border border-dark p-3 text-center">
                        <h2> > ${entry} < </h2>
                        </div>
                        `)
              continue
            }
            list.push(`
                    <div class="col text-start ${proConColourDict[headerPosition]} border border-dark p-2">
                    ${entry}
                    </div>
                    `)
          }
          document.getElementById('information-div').innerHTML = list.join('')
          break

        case 'biology':
        case 'history':
        case 'faq':
          for (let i = 0; i < data[queryType].length; i++) {
            const entry = data[queryType][i]
            list.push(`
                    <div class="col text-start fs-6 ${
                      itemColourDict[i % 2]
                    } border border-dark p-2">
                    ${entry}
                    </div>
                    `)
          }
          document.getElementById('information-div').innerHTML = list.join('')
          break
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      displayErrorMessage()
    })
}

async function updateCommentInfo () {
  await fetch(`${localHost}/goatData/${currentSpecies}`)
    .then((response) => response.json())
    .then((data) => {
      const HTML = `<p class="lead fst-italic fs-4 text-end">Viewing <b>${data.name.toString()}</b> form</p>`
      document.getElementById('comment-info-div').innerHTML = HTML
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      displayErrorMessage()
    })
}

async function updateCommentThread () {
  const list = []
  let HTML
  await fetch(`${localHost}/commentData/${currentSpecies}/${orderingSelection}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        list.push(`
                <div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[0]}">
                <div class="col">
                <div class="text-center"><strong>No one commented yet, be the first to do so!</div>
                </div>
                </div>
                `)
      } else {
        for (let i = 0; i < data.length; i++) {
          list.push(`
                    <div class="row mt-2 mb-2 border border-dark p-3 ${itemColourDict[i % 2]}">
                    <div class="col-4 border-end border-dark p-3">
                    <div class="text-center" id="date_time_${i}">${data[i].date} at ${data[i].time}</div>
                    <div class="text-center p-1" id="name_${i}">From : ${data[i].name}</div>
                    <div class="text-center p-1" id="likes_${i}">Likes : ${data[i].like}</div>
                    <button type="button" class="btn btn-success" id="${data[i].name}-${data[i].date}-${data[i].time}">Like</button>
                    <div id="alert-${data[i].name}-${data[i].date}-${data[i].time}"></div>
                    </div>
                    <div class="col-8 d-flex align-items-center justify-content-center">
                    <div class="text-center scroll-item">${data[i].comment}</div>
                    </div>
                    </div>
                    `)
        }
      }
      HTML = list.join('')
      document.getElementById('comment-thread-div').innerHTML = HTML
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      displayErrorMessage()
    })
}

async function updateImg () {
  let HTML
  const species = currentSpecies
  const list = []
  await fetch(`${localHost}/imageData/${currentSpecies}`)
    .then(response => response.json())
    .then(data => {
      list.push(`
        <div id="carouselCaptions" class="carousel slide">
        <div class="carousel-indicators">
        `)

      for (let i = 0; i < data.image.length; i++) {
        let activeClass = i
        if (i === 0) {
          activeClass = ' class="active" aria-current="true"'
        } else {
          activeClass = ''
        }
        list.push(`
          <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="${i}"${activeClass} aria-label="Uploaded by ${data.uploader[i]}">
          </button>
          `)
      }

      list.push(`
        </div>
        <div class="carousel-inner">
      `)

      for (let i = 0; i < data.image.length; i++) {
        let activeClass = i
        if (i === 0) {
          activeClass = ' active'
        } else {
          activeClass = ''
        }
        list.push(`
              <div class="carousel-item${activeClass}">
              <img id="carousel-img" class="p-2" src="assets/images/${species}/${data.image[i]}.jpg" class="d-block w-100" alt="${species} image ${data.image[i]}">
                  <div class="carousel-caption d-none d-md-block text-dark">
                      <h5><strong class="carousel-text glow">${upperCase(data.image[i])}</strong></h5>
                      <p><strong class="carousel-text glow">Uploaded by ${data.uploader[i]}</strong></p>        
                  </div>
              </div>
              `)
      }

      list.push(`
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
        </button>
        </div>
        `)
      HTML = list.join('')
      document.getElementById('img-div').innerHTML = HTML
    })
    .catch(error => {
      console.error('Error fetching data:', error)
      displayErrorMessage()
    })
}

async function submitComment () {
  const currentDate = new Date()
  const dateData = await formatDate(currentDate)
  const timeData = await formatTime(currentDate)
  const commentData = document.getElementById('comment-input').value

  if (commentData === '') {
    document.getElementById('logout-button').style.display = 'none'
    document.getElementById('comment-alert-div').innerHTML =
      '<div class="alert alert-danger" role="alert">You Can Not Leave A Empty Comment!</div>'
    return
  } else {
    document.getElementById('login-button').style.display = 'block'
    document.getElementById('logout-button').style.display = 'none'
    document.getElementById('comment-alert-div').innerHTML = ''
  }

  let data = {
    species: currentSpecies,
    name: currentUser,
    comment: commentData,
    date: dateData,
    time: timeData,
    like: 0,
    likeBy: []
  }

  data = JSON.stringify(data)
  const response = await fetch(`${localHost}/post/commentData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
  if (!(response.text() === 'success')) {
    displayErrorMessage()
  }
  document.getElementById('comment-input').value = ''
  updateCommentThread()
}

async function signUpUser () {
  const passwordData = document.getElementById('password-signup').value
  const usernameData = document.getElementById('username-signup').value

  if (usernameData === '') {
    document.getElementById('modal-signup-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">You Can Not Have A Empty Username!</div>'
    return
  } else {
    document.getElementById('modal-signup-alert').innerHTML = ''
  }

  if (passwordData === '') {
    document.getElementById('modal-signup-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">You Can Not Have A Empty Password!</div>'
    return
  } else {
    document.getElementById('modal-signup-alert').innerHTML = ''
  }

  let data = {
    username: usernameData,
    password: passwordData
  }
  data = JSON.stringify(data)

  const response = await fetch(`${localHost}/post/signupData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })

  const responseText = await response.text()
  if (responseText === 'usernameTaken') {
    document.getElementById('modal-signup-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">That Username Is Already Taken!</div>'
    return
  }
  document.getElementById('username-signup').value = ''
  document.getElementById('password-signup').value = ''
  hideModal('signup-modal')
}

async function userLogin () {
  const usernameData = document.getElementById('username-login').value
  const passwordData = document.getElementById('password-login').value

  if (usernameData === '') {
    document.getElementById('modal-login-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">You Can Not Have A Empty Username!</div>'
    return
  } else {
    document.getElementById('modal-login-alert').innerHTML = ''
  }

  if (passwordData === '') {
    document.getElementById('modal-login-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">You Can Not Have A Empty Password!</div>'
    return
  } else {
    document.getElementById('modal-login-alert').innerHTML = ''
  }

  let data = {
    username: usernameData,
    password: passwordData
  }
  data = JSON.stringify(data)

  const response = await fetch(`${localHost}/post/loginStatus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })

  const responseText = await response.text()
  if (responseText === 'invalidLogin') {
    document.getElementById('modal-login-alert').innerHTML =
      '<div class="alert alert-danger" role="alert">Login Does Not To Any In The Database!</div>'
    return
  }

  currentUser = responseText
  document.getElementById('login-button').style.display = 'none'
  document.getElementById('logout-button').style.display = 'block'
  hideModal('login-modal')
  document.getElementById('username-login').value = ''
  document.getElementById('password-login').value = ''
  updateNameDisplay()
}

async function uploadPhoto () {
  const photoUpload = document.getElementById('photo-input')

  if (document.getElementById('photo-input').value === '') {
    document.getElementById('upload-alert-div').innerHTML =
      '<div class="alert alert-danger" role="alert">No Photo Selected!</div>'
    return
  } else {
    document.getElementById('upload-alert-div').innerHTML = ''
  }

  if (currentUser === 'Anonymous') {
    document.getElementById('upload-alert-div').innerHTML =
      '<div class="alert alert-danger" role="alert">You Must Be Login To Upload A Image!</div>'
    return
  }

  const data = new FormData()
  data.append('photo', photoUpload.files[0])
  let fileName = photoUpload.files[0].name
  fileName = fileName.substring(0, fileName.length - 4)

  const response = await fetch(
    `${localHost}/post/${currentSpecies}/uploadPhoto`,
    {
      method: 'POST',
      body: data
    }
  )
  if (!(response.text() === 'success')) {
    displayErrorMessage()
  }

  let data2 = {
    species: currentSpecies,
    image: fileName,
    uploader: currentUser
  }
  data2 = JSON.stringify(data2)

  const response2 = await fetch(
    `${localHost}/post/${currentSpecies}/photoData`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data2
    }
  )

  if (!(response2.text() === 'success')) {
    displayErrorMessage()
  }

  document.getElementById('photo-input').value = ''
  updateImg()
}

async function likeComment (name, date, time) {
  try {
    if (currentUser === 'Anonymous') {
      document.getElementById(`alert-${name}-${date}-${time}`).innerHTML =
        '<div class="alert alert-danger" role="alert">Login to Like!</div>'
      return
    } else {
      document.getElementById(`alert-${name}-${date}-${time}`).innerHTML = ''
    }
    let data = {
      name,
      date,
      time,
      currentUser
    }

    data = JSON.stringify(data)

    const response = await fetch(`${localHost}/post/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })

    const responseText = await response.text()

    if (responseText === 'error') {
      document.getElementById(`alert-${name}-${date}-${time}`).innerHTML =
        '<div class="alert alert-danger" role="alert">Error Fetching Data!</div>'
    } else if (responseText === 'alreadyLiked') {
      document.getElementById(`alert-${name}-${date}-${time}`).innerHTML =
        '<div class="alert alert-danger" role="alert">You Already Liked This Comment!</div>'
    } else {
      document.getElementById(`alert-${name}-${date}-${time}`).innerHTML = ''
      updateCommentThread()
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    displayErrorMessage()
  }
}

function likeButtonClick (event) {
  console.log(event.target.tagName)
  if (event.target.tagName === 'BUTTON') {
    const buttonId = event.target.id
    const [name, date, time] = buttonId.split('-')
    likeComment(name, date, time)
  }
}

document.addEventListener('DOMContentLoaded', initializeHTML)
document.getElementById('navbar-icon').addEventListener('click', fetchDataDefault)
document.getElementById('kiko-goat').addEventListener('click', () => fetchGoatData('kiko_goat'))
document.getElementById('pygora-goat').addEventListener('click', () => fetchGoatData('pygora_goat'))
document.getElementById('angora-goat').addEventListener('click', () => fetchGoatData('angora_goat'))
document.getElementById('pygmy-goat').addEventListener('click', () => fetchGoatData('pygmy_goat'))
document.getElementById('information-select').addEventListener('change', informationSelected)
document.getElementById('comment-submit').addEventListener('click', submitComment)
document.getElementById('modal-signup-button').addEventListener('click', signUpUser)
document.getElementById('logout-button').addEventListener('click', userLogout)
document.getElementById('modal-login-button').addEventListener('click', userLogin)
document.getElementById('upload-button').addEventListener('click', uploadPhoto)
document.getElementById('ordering-select').addEventListener('change', orderingSelected)
document.getElementById('comment-thread-div').addEventListener('click', event => {
  likeButtonClick(event)
})
document.getElementById('reload-button').addEventListener('click', checkErrorServerStatus)

setInterval(checkServerStatus, 10000)
