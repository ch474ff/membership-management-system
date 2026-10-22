class Member < ApplicationRecord
  has_secure_password

  has_many :memberships, dependent: :destroy
  has_many :teams, through: :memberships

  validates :name, presence: true
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false }
  validates :role, inclusion: { in: %w[admin member] }
  validates :status, inclusion: { in: %w[active inactive] }
end
