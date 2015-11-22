Rails.application.routes.draw do

  root 'transactions#new'

  resources :transactions

end