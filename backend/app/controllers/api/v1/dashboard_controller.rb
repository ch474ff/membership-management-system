class Api::V1::DashboardController < Api::BaseController
  def index
    render json: {
      total_members: Member.count,
      active_members: Member.where(status: "active").count,
      inactive_members: Member.where(status: "inactive").count,
      members_by_department: Member.group(:department).count,
      members_by_year: Member.group(:year).count,
      team_distribution: Team.left_joins(:memberships)
                             .group("teams.id", "teams.name")
                             .count,
      recently_added: Member.order(created_at: :desc)
                            .limit(5)
                            .as_json(only: [:id, :name, :department, :year, :created_at])
    }
  end
end
