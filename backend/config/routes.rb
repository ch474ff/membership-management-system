Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "register", to: "auth#register"
      post "login", to: "auth#login"
      delete "logout", to: "auth#logout"
      get "me", to: "auth#me"

      resources :members
      resources :teams
      resources :memberships, only: [:index, :create, :destroy]

      get "dashboard", to: "dashboard#index"
    end
  end
end
