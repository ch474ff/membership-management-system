class Team < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships

  validates :name, presence: true, uniqueness: true
end
