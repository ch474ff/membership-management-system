class Membership < ApplicationRecord
  belongs_to :member
  belongs_to :team

  validates :designation, presence: true
  validates :member_id, uniqueness: { scope: :team_id }
end
